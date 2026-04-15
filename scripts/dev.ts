import { config } from "dotenv";
import { execSync } from "child_process";

config({ path: ".env.local" });

const supabaseProjectRef = process.env.SUPABASE_PROJECT_REF;
if (!supabaseProjectRef) {
  console.error("SUPABASE_PROJECT_REF nao configurada no .env.local");
  process.exit(1);
}

const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN;
const execEnv = supabaseAccessToken
  ? { ...process.env, SUPABASE_ACCESS_TOKEN: supabaseAccessToken }
  : process.env;

execSync(`supabase link --project-ref ${supabaseProjectRef}`, {
  stdio: "inherit",
  env: execEnv,
});
execSync("supabase db push", { stdio: "inherit", env: execEnv });
execSync("next dev", { stdio: "inherit" });
