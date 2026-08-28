// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

function initDatabase() {
  // If cloud database (Postgres) is configured, use it directly
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
    return process.env.DATABASE_URL
  }

  // In Vercel / AWS Lambda serverless environment, local filesystem is read-only except /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = '/tmp/dev.db'
    if (!fs.existsSync(tmpDbPath)) {
      const possibleSources = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ]
      for (const src of possibleSources) {
        if (fs.existsSync(src)) {
          try {
            fs.copyFileSync(src, tmpDbPath)
            break
          } catch (e) {
            console.error('Error copying db to /tmp:', e)
          }
        }
      }
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`
    return `file:${tmpDbPath}`
  }

  return process.env.DATABASE_URL || 'file:./dev.db'
}

initDatabase()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
