import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  // 1. Schema Location
  schema: "prisma/schema.prisma",

  // 2. Migration & Seeding Strategy
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // 3. Database Connection
  datasource: {
    url: env("DATABASE_URL"),
  },
});
