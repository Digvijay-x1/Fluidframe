import { defineConfig, env } from "prisma/config";
import "dotenv/config"; // Loads your .env file

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // In Prisma 7, we define the URL here instead of schema.prisma
    url: env("DATABASE_URL"),
  },
});
