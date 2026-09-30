import { defineConfig } from "prisma/config";
import "dotenv/config"; // Loads your .env file

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // In Prisma 7, we define the URL here instead of schema.prisma
    // Generation needs no database. Database commands still require a real URL.
    url: process.env.DATABASE_URL,
  },
});
