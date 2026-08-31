import { revalidatePath } from "next/cache";
import { getAdminIdentity } from "@/lib/auth";
import {
  MAX_MEDIA_BYTES,
  safeOriginalName,
  validateMediaBytes,
} from "@/lib/media/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function textValue(formData: FormData, name: string, maximum: number) {
  return String(formData.get(name) ?? "").trim().slice(0, maximum);
}

function positiveDimension(value: FormDataEntryValue | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 20_000
    ? parsed
    : null;
}

function jsonError(message: string, status: number) {
  return Response.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && origin !== requestUrl.origin) {
    return jsonError("Cross-origin uploads are not allowed.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_MEDIA_BYTES + 1024 * 1024) {
    return jsonError("The upload exceeds the 25 MB limit.", 413);
  }

  const identity = await getAdminIdentity();
  if (!identity) return jsonError("Sign in to upload media.", 401);

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return jsonError("Choose a file to upload.", 400);

    const bytes = new Uint8Array(await file.arrayBuffer());
    const validated = validateMediaBytes(bytes, file.type || null);
    const altText = textValue(formData, "alt_text", 240);
    if (validated.isImage && altText.length < 3) {
      return jsonError("Add useful alternative text for this image.", 400);
    }

    const caption = textValue(formData, "caption", 500);
    const credit = textValue(formData, "credit", 240);
    const width = validated.isImage ? positiveDimension(formData.get("width")) : null;
    const height = validated.isImage ? positiveDimension(formData.get("height")) : null;
    const objectPath = `uploads/${identity.id}/${crypto.randomUUID()}.${validated.extension}`;
    const supabase = await createSupabaseServerClient();

    const { error: uploadError } = await supabase.storage
      .from("cms-staging")
      .upload(objectPath, bytes, {
        cacheControl: "3600",
        contentType: validated.mimeType,
        upsert: false,
      });
    if (uploadError) {
      return jsonError(`Storage rejected the upload: ${uploadError.message}`, 400);
    }

    const { data: asset, error: metadataError } = await supabase
      .from("media_assets")
      .insert({
        bucket: "cms-staging",
        object_path: objectPath,
        original_name: safeOriginalName(file.name),
        mime_type: validated.mimeType,
        byte_size: bytes.length,
        width,
        height,
        alt_text: altText,
        caption,
        credit,
        status: "draft",
        uploaded_by: identity.id,
        updated_by: identity.id,
      })
      .select("id")
      .single();

    if (metadataError) {
      await supabase.storage.from("cms-staging").remove([objectPath]);
      return jsonError(`Media metadata could not be saved: ${metadataError.message}`, 400);
    }

    revalidatePath("/admin/media");
    return Response.json({
      ok: true,
      id: asset.id,
      message: "Upload complete. An editor can now publish it.",
    }, { status: 201 });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "The upload could not be processed.",
      400,
    );
  }
}
