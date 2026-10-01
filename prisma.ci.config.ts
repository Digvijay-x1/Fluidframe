import { defineConfig } from "prisma/config";
import { testDatabaseUrl } from "./scripts/test-database-url.mjs";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: testDatabaseUrl(process.env.FLUIDFRAME_TEST_DATABASE_URL),
  },
});
