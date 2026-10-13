// Concatenates supabase/migrations/*.sql (in order) into supabase/setup_all.sql for a one-paste setup.
import fs from "node:fs";
import path from "node:path";

const dir = "supabase/migrations";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const header = [
  "-- NextBuildBD: full database setup in one paste (Supabase → SQL Editor → New query → paste → Run).",
  "-- Generated from supabase/migrations/*.sql in order; run it once on a fresh project.",
  "-- Regenerate after changing a migration: npm run db:bundle",
  "",
  "",
].join("\n");
const body = files.map((f) => `-- ===== ${f} =====\n${fs.readFileSync(path.join(dir, f), "utf8")}\n`).join("");
fs.writeFileSync("supabase/setup_all.sql", header + body);
console.log(`supabase/setup_all.sql ← ${files.join(", ")}`);
