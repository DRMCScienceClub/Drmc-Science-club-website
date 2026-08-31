import "server-only";

export const MAX_MEDIA_BYTES = 25 * 1024 * 1024;

export const acceptedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
] as const;

export type AcceptedMediaType = (typeof acceptedMediaTypes)[number];

const extensions: Record<AcceptedMediaType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

function startsWith(bytes: Uint8Array, signature: readonly number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

export function detectMediaType(bytes: Uint8Array): AcceptedMediaType | null {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP") {
    return "image/webp";
  }
  if (ascii(bytes, 4, 4) === "ftyp") {
    const brands = ascii(bytes, 8, Math.min(bytes.length - 8, 24));
    if (brands.includes("avif") || brands.includes("avis")) return "image/avif";
  }
  if (ascii(bytes, 0, 5) === "%PDF-") return "application/pdf";
  return null;
}

export function validateMediaBytes(
  bytes: Uint8Array,
  declaredType?: string | null,
) {
  if (!bytes.length) throw new Error("Choose a non-empty file.");
  if (bytes.length > MAX_MEDIA_BYTES) {
    throw new Error("The file exceeds the 25 MB upload limit.");
  }

  const detectedType = detectMediaType(bytes);
  if (!detectedType) {
    throw new Error("Unsupported file signature. Use JPEG, PNG, WebP, AVIF, or PDF.");
  }
  if (declaredType && declaredType !== detectedType) {
    throw new Error("The file contents do not match the browser-reported file type.");
  }

  return {
    mimeType: detectedType,
    extension: extensions[detectedType],
    isImage: detectedType.startsWith("image/"),
  };
}

export function safeOriginalName(value: string) {
  const normalized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[\\/]+/g, "-")
    .trim();
  return (normalized || "upload").slice(0, 180);
}
