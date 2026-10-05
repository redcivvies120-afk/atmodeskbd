import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const p = await prisma.product.findMany({
    where: { isActive: true },
    select: { name: true, slug: true, reviewCount: true, rating: true },
  })
  console.log('ACTIVE PRODUCTS WITH REVIEWS:')
  for (const item of p) {
    console.log(`• https://atmodeskbd-eo1e.vercel.app/product/${item.slug}`)
    console.log(`  Rating: ${item.rating}★ | Reviews: ${item.reviewCount}`)
  }
}

main().finally(() => prisma.$disconnect())
