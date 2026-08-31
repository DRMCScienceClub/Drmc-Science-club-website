import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

function requireEnvironment(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

async function findUserByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<User | undefined> {
  const perPage = 200;

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw new Error(`Could not inspect Auth users: ${error.message}`);
    }

    const match = data.users.find(
      (user) => normalizeEmail(user.email ?? "") === email,
    );
    if (match) {
      return match;
    }
    if (data.users.length < perPage) {
      return undefined;
    }
  }
}

async function main(): Promise<void> {
  if (process.env.ALLOW_INITIAL_ADMIN_BOOTSTRAP !== "true") {
    throw new Error(
      "Bootstrap is disabled. Set ALLOW_INITIAL_ADMIN_BOOTSTRAP=true for this one run only.",
    );
  }

  const supabaseUrl = requireEnvironment("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnvironment("SUPABASE_SERVICE_ROLE_KEY");
  const email = normalizeEmail(requireEnvironment("INITIAL_ADMIN_EMAIL"));
  const password = requireEnvironment("INITIAL_ADMIN_PASSWORD");
  const fullName = requireEnvironment("INITIAL_ADMIN_NAME");

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("INITIAL_ADMIN_EMAIL is not a valid email address.");
  }
  if (password.length < 12) {
    throw new Error("INITIAL_ADMIN_PASSWORD must contain at least 12 characters.");
  }
  if (fullName.length < 2) {
    throw new Error("INITIAL_ADMIN_NAME must contain at least 2 characters.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { data: activeSuperAdmins, error: profileReadError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "super_admin")
    .eq("is_active", true)
    .limit(1);

  if (profileReadError) {
    throw new Error(`Could not inspect administrator profiles: ${profileReadError.message}`);
  }
  if (activeSuperAdmins.length > 0) {
    throw new Error(
      "An active super administrator already exists. The one-time bootstrap will not run again.",
    );
  }

  let user = await findUserByEmail(supabase, email);
  let createdUser = false;

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      throw new Error(`Could not create the initial Auth user: ${error.message}`);
    }
    user = data.user;
    createdUser = true;
  }

  const { error: profileWriteError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      full_name: fullName,
      role: "super_admin",
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (profileWriteError) {
    throw new Error(
      `Auth user exists, but profile activation failed: ${profileWriteError.message}`,
    );
  }

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_id: user.id,
    actor_email: email,
    action: "bootstrap_super_admin",
    entity_type: "profiles",
    entity_id: user.id,
    after_data: {
      role: "super_admin",
      is_active: true,
      auth_user_created: createdUser,
    },
  });

  if (auditError) {
    console.warn(`Administrator was created, but the audit insert failed: ${auditError.message}`);
  }

  console.log(
    createdUser
      ? "Initial super administrator created and activated."
      : "Existing Auth user promoted to the initial active super administrator; its password was not changed.",
  );
  console.log(
    "Immediately remove INITIAL_ADMIN_PASSWORD, set ALLOW_INITIAL_ADMIN_BOOTSTRAP=false, and restart/redeploy the application.",
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unknown bootstrap failure");
  process.exitCode = 1;
});
