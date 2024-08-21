// @ts-ignore
// @ts-ignore
// @ts-nocheck

import { defineConfig } from "@snaplet/seed/config";
import { SeedPostgres } from "@snaplet/seed/adapter-postgres";
import postgres from "postgres";

const url = {
  dev: process.env.POSTGRES_URL,
  prod: "postgres://default:30fRXznDjkbI@ep-solitary-firefly-a4f278w7.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
};

export default defineConfig({
  adapter: () => {
    const POSTGRES_URL: string | undefined = url.dev;
    if (!POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not defined");
    }

    const client = postgres(POSTGRES_URL);

    return new SeedPostgres(client);
  },
});
