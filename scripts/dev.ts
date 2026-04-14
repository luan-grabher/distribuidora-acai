import { config } from "dotenv";
import { execSync } from "child_process";

config({ path: ".env.local" });

const supabaseProjectRef = process.env.SUPABASE_PROJECT_REF;
if (!supabaseProjectRef) {
  console.error("SUPABASE_PROJECT_REF nao configurada no .env.local");
  process.exit(1);
}

execSync(`supabase link --project-ref ${supabaseProjectRef}`, {
  stdio: "inherit",
});
execSync("supabase db push", { stdio: "inherit" });
execSync("next dev", { stdio: "inherit" });
