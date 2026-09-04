// src/lib/init-db.ts
// In PostgreSQL with Neon, schema tables are managed by Prisma migration / db push

export async function ensureDatabaseTables() {
  // No-op for PostgreSQL
  return Promise.resolve()
}
