// prisma/clean-products.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Removing all dummy products from database...')

  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productSpec.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()

  console.log('✅ All products removed! The database is now ready for your manual product uploads via the Admin Portal.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
