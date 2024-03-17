import { cleanEnv, str, port, num } from "envalid";

function validateEnv() {
  const env = cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production", "test"],
    }),
    ACCESS_TOKEN_PRIVATE_KEY: str(),
    REFRESH_TOKEN_PRIVATE_KEY: str(),
    PORT: port({ default: 5000 }),
    NUM_PHYSICAL_CPUS: num(),
  });

  return env;
}

export default validateEnv;
