// src/lib/init-db.ts
import { prisma } from './prisma'

let isInitialized = false

export async function ensureDatabaseTables() {
  if (isInitialized) return
  try {
    // Execute DDL for SQLite to guarantee tables always exist on Vercel serverless
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT,
        "email" TEXT NOT NULL UNIQUE,
        "phone" TEXT,
        "emailVerified" DATETIME,
        "image" TEXT,
        "password" TEXT,
        "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Address" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "label" TEXT NOT NULL DEFAULT 'Home',
        "fullName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "line1" TEXT NOT NULL,
        "line2" TEXT,
        "area" TEXT,
        "city" TEXT NOT NULL,
        "district" TEXT NOT NULL,
        "postalCode" TEXT,
        "isDefault" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "image" TEXT,
        "icon" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Brand" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "logo" TEXT,
        "website" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT PRIMARY KEY,
        "sku" TEXT NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT NOT NULL,
        "details" TEXT,
        "categoryId" TEXT NOT NULL,
        "brandId" TEXT,
        "price" REAL NOT NULL,
        "originalPrice" REAL,
        "discount" REAL NOT NULL DEFAULT 0,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "weight" REAL,
        "dimensions" TEXT,
        "isFeatured" BOOLEAN NOT NULL DEFAULT 0,
        "isBestSeller" BOOLEAN NOT NULL DEFAULT 0,
        "isNewArrival" BOOLEAN NOT NULL DEFAULT 1,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "rating" REAL NOT NULL DEFAULT 5.0,
        "reviewCount" INTEGER NOT NULL DEFAULT 0,
        "soldCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ProductImage" (
        "id" TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "altText" TEXT,
        "isPrimary" BOOLEAN NOT NULL DEFAULT 0,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ProductVariant" (
        "id" TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "price" REAL,
        "sku" TEXT,
        "stock" INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ProductSpec" (
        "id" TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL,
        "group" TEXT,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT PRIMARY KEY,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "addressId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
        "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
        "subtotal" REAL NOT NULL,
        "discountAmount" REAL NOT NULL DEFAULT 0,
        "shippingCost" REAL NOT NULL DEFAULT 60,
        "total" REAL NOT NULL,
        "couponCode" TEXT,
        "notes" TEXT,
        "shippingMethod" TEXT NOT NULL DEFAULT 'Inside Dhaka',
        "trackingNumber" TEXT,
        "estimatedDelivery" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "variantId" TEXT,
        "name" TEXT NOT NULL,
        "image" TEXT,
        "price" REAL NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "total" REAL NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Coupon" (
        "id" TEXT PRIMARY KEY,
        "code" TEXT NOT NULL UNIQUE,
        "discountType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
        "discountValue" REAL NOT NULL,
        "minOrderAmount" REAL NOT NULL DEFAULT 0,
        "maxDiscount" REAL,
        "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "endDate" DATETIME,
        "usageLimit" INTEGER,
        "usageCount" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    isInitialized = true
  } catch (error) {
    console.error('ensureDatabaseTables error:', error)
  }
}
