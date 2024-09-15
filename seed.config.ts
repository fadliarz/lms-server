// @ts-ignore
// @ts-ignore
// @ts-nocheck

import { defineConfig } from "@snaplet/seed/config";
import { SeedPostgres } from "@snaplet/seed/adapter-postgres";
import postgres from "postgres";

export default defineConfig({
  adapter: () => {
    const POSTGRES_URL: string | undefined = process.env.POSTGRES_URL;
    if (!POSTGRES_URL) {
      throw new Error("POSTGRES_URL is not defined");
    }

    const client = postgres(POSTGRES_URL);

    return new SeedPostgres(client);
  },
});
