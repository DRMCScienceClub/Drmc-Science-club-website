import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const directory = new URL("../supabase/migrations/", import.meta.url);
const migrations = readdirSync(directory).filter((file) => file.endsWith(".sql")).sort();
const sources = migrations.map((file) => ({ file, sql: readFileSync(new URL(file, directory), "utf8") }));
const repair = sources.find(({ file }) => file.includes("008_explicit_data_api_permissions")).sql;

test("all public tables record scoped ACLs in their creating migration", () => {
  const tables = [];
  for (const { file, sql } of sources) {
    assert.doesNotMatch(sql, /grant\s+[^;]+\bon\s+all\s+(tables|sequences)\b/i, file);
    for (const [, table] of sql.matchAll(/create table (?:if not exists )?public\.(\w+)/gi)) {
      tables.push(table);
      const grants = [...sql.matchAll(/(?:grant|revoke)\s+[^;]+;/gi)].map(([statement]) => statement);
      assert.ok(grants.some((statement) => statement.includes(`public.${table}`)), `${file}: missing explicit ACL for ${table}`);
      assert.ok(repair.includes(`public.${table}`), `forward repair missing ${table}`);
    }
  }
  assert.equal(tables.length, 20);
});

test("repair is scoped, transactional, and does not alter policies or table data", () => {
  const statements = repair.replace(/--[^\n]*/g, "").split(";").map((item) => item.trim()).filter(Boolean);
  assert.equal(statements[0], "begin");
  assert.equal(statements.at(-1), "commit");
  for (const statement of statements) assert.match(statement, /^(begin|commit|grant|revoke)\b/i);
  assert.doesNotMatch(repair, /grant\s+(?:all|insert)[^;]*to anon/i);
  assert.match(repair, /grant usage on sequence public\.audit_logs_id_seq to service_role/);
  assert.doesNotMatch(repair, /grant[^;]+sequence[^;]+to authenticated/i);
});

test("secure submission migrations retain RPC gates and column-level reviewer access", () => {
  const secure = sources.find(({ file }) => file.includes("003_secure_public")).sql;
  const membership = sources.find(({ file }) => file.includes("006_science_club")).sql;
  assert.match(secure, /revoke insert on public\.contact_submissions, public\.join_submissions from anon, authenticated/);
  assert.match(secure, /grant execute on function public\.submit_public_contact[^;]+to anon, authenticated/);
  assert.match(membership, /grant execute on function public\.submit_science_club_application[^;]+to service_role/);
  assert.doesNotMatch(membership, /grant all on public\.science_club_applications/);
  assert.match(repair, /grant update \(status, admin_notes\) on public\.science_club_applications to authenticated/);
});
