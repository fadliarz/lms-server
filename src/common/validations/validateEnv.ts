import { cleanEnv, str, port } from "envalid";

function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production"],
    }),
    ACCESS_TOKEN_PRIVATE_KEY: str(),
    REFRESH_TOKEN_PRIVATE_KEY: str(),
    DATABASE_URL: str(),
    PORT: port({ default: 5000 }),
  });
}

export default validateEnv;
