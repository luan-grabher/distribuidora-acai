import { config } from "dotenv";
import { execSync } from "child_process";

config({ path: ".env.local" });

const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN;
const execEnv = supabaseAccessToken
  ? { ...process.env, SUPABASE_ACCESS_TOKEN: supabaseAccessToken }
  : process.env;


execSync("supabase db push", { stdio: "inherit", env: execEnv });
execSync("next dev", { stdio: "inherit" });
