import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Supabase: use DIRECT_DATABASE_URL (port 5432) for migrations; DATABASE_URL pooler (6543) for the app.
const migrationUrl = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error("Set DATABASE_URL (and DIRECT_DATABASE_URL for Supabase migrations) in .env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl,
  },
});
