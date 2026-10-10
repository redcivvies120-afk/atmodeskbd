import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 55 Realistic Bangladeshi Reviewer Profiles
const REVIEWERS = [
  { name: 'Tanvir Ahmed', email: 'tanvir.ahmed.bd91@gmail.com', city: 'Dhaka' },
  { name: 'Sadia Rahman', email: 'sadia.rahman.tech@gmail.com', city: 'Uttara, Dhaka' },
  { name: 'Mahir Faisal', email: 'mahir.faisal.dev@gmail.com', city: 'Gulshan, Dhaka' },
  { name: 'Farhan Ishrak', email: 'farhan.ishrak.bd@gmail.com', city: 'Mirpur, Dhaka' },
  { name: 'Nusrat Jahan', email: 'nusrat.jahan.ctg@gmail.com', city: 'Chittagong' },
  { name: 'Tahmid Hasan', email: 'tahmid.hasan.syl@gmail.com', city: 'Sylhet' },
  { name: 'Nafis Fuad', email: 'nafis.fuad.desk@gmail.com', city: 'Dhanmondi, Dhaka' },
  { name: 'Anika Tabassum', email: 'anika.tabassum98@gmail.com', city: 'Banani, Dhaka' },
  { name: 'Zubair Hossain', email: 'zubair.hossain.raj@gmail.com', city: 'Rajshahi' },
  { name: 'Rashed Al-Mamun', email: 'rashed.mamun.khu@gmail.com', city: 'Khulna' },
  { name: 'Minhaz Uddin', email: 'minhaz.uddin.com@gmail.com', city: 'Cumilla' },
  { name: 'Arafat Rahman', email: 'arafat.rahman.bd@gmail.com', city: 'Dhaka' },
  { name: 'Sabiha Akter', email: 'sabiha.akter.bar@gmail.com', city: 'Barishal' },
  { name: 'Kazi Shafiul', email: 'kazi.shafiul.ran@gmail.com', city: 'Rangpur' },
  { name: 'Fahim Muntasir', email: 'fahim.muntasir.gaz@gmail.com', city: 'Gazipur' },
  { name: 'Sumaiya Islam', email: 'sumaiya.islam.tech@gmail.com', city: 'Dhaka' },
  { name: 'Imtiaz Ahmed', email: 'imtiaz.ahmed.ctg@gmail.com', city: 'Chittagong' },
  { name: 'Rayhan Kabir', email: 'rayhan.kabir.bd@gmail.com', city: 'Dhaka' },
  { name: 'Sabrina Sultana', email: 'sabrina.sultana.desk@gmail.com', city: 'Dhaka' },
  { name: 'Arifur Rahman', email: 'arifur.rahman.bog@gmail.com', city: 'Bogura' },
  { name: 'Shakil Mahmud', email: 'shakil.mahmud.bd@gmail.com', city: 'Narayanganj' },
  { name: 'Nabila Haque', email: 'nabila.haque.desk@gmail.com', city: 'Dhaka' },
  { name: 'Asifur Rahman', email: 'asifur.rahman.dev@gmail.com', city: 'Dhaka' },
  { name: 'Mehedi Hasan', email: 'mehedi.hasan.bd@gmail.com', city: 'Kushtia' },
  { name: 'Jannatul Ferdous', email: 'jannatul.ferdous.bd@gmail.com', city: 'Dhaka' },
  { name: 'Sazzad Hossain', email: 'sazzad.hossain.desk@gmail.com', city: 'Dhaka' },
  { name: 'Tasnim Zahin', email: 'tasnim.zahin.bd@gmail.com', city: 'Chittagong' },
  { name: 'Mustafizur Rahman', email: 'mustafiz.rahman.bd@gmail.com', city: 'Dhaka' },
  { name: 'Farzana Yeasmin', email: 'farzana.yeasmin.bd@gmail.com', city: 'Sylhet' },
  { name: 'Towhidul Islam', email: 'towhid.islam.desk@gmail.com', city: 'Dhaka' },
  { name: 'Shahed Parvez', email: 'shahed.parvez.bd@gmail.com', city: 'Dhaka' },
  { name: 'Nazmus Sakib', email: 'nazmus.sakib.tech@gmail.com', city: 'Mymensingh' },
  { name: 'Rifat Chowdhury', email: 'rifat.chowdhury.ctg@gmail.com', city: 'Chittagong' },
  { name: 'Ishrat Jahan', email: 'ishrat.jahan.bd@gmail.com', city: 'Dhaka' },
  { name: 'Al-Amin Hossain', email: 'alamin.hossain.bd@gmail.com', city: 'Dhaka' },
  { name: 'Tanzina Akhter', email: 'tanzina.akhter.bd@gmail.com', city: 'Dhaka' },
  { name: 'Hasibul Islam', email: 'hasibul.islam.dev@gmail.com', city: 'Rajshahi' },
  { name: 'Mithila Roy', email: 'mithila.roy.bd@gmail.com', city: 'Khulna' },
  { name: 'Rezaul Karim', email: 'rezaul.karim.bd@gmail.com', city: 'Dhaka' },
  { name: 'Shamim Osman', email: 'shamim.osman.bd@gmail.com', city: 'Dhaka' },
  { name: 'Munira Begum', email: 'munira.begum.bd@gmail.com', city: 'Dhaka' },
  { name: 'Kamrul Hassan', email: 'kamrul.hassan.bd@gmail.com', city: 'Dhaka' },
  { name: 'Zarin Subah', email: 'zarin.subah.bd@gmail.com', city: 'Chittagong' },
  { name: 'Faisal Mahmud', email: 'faisal.mahmud.tech@gmail.com', city: 'Dhaka' },
  { name: 'Sharmin Sultana', email: 'sharmin.sultana.bd@gmail.com', city: 'Dhaka' },
  { name: 'Nahid Hasan', email: 'nahid.hasan.dev@gmail.com', city: 'Dhaka' },
  { name: 'Tasmia Noor', email: 'tasmia.noor.bd@gmail.com', city: 'Dhaka' },
  { name: 'Arman Hossain', email: 'arman.hossain.ctg@gmail.com', city: 'Chittagong' },
  { name: 'Rubayat Islam', email: 'rubayat.islam.bd@gmail.com', city: 'Dhaka' },
  { name: 'Farzana Kabir', email: 'farzana.kabir.bd@gmail.com', city: 'Sylhet' },
  { name: 'Shourav Das', email: 'shourav.das.ctg@gmail.com', city: 'Chittagong' },
  { name: 'Lamia Tabassum', email: 'lamia.tabassum.bd@gmail.com', city: 'Dhaka' },
  { name: 'Ehsanul Haque', email: 'ehsanul.haque.bd@gmail.com', city: 'Dhaka' },
  { name: 'Adnan Sami', email: 'adnan.sami.desk@gmail.com', city: 'Dhaka' },
  { name: 'Marium Khan', email: 'marium.khan.bd@gmail.com', city: 'Dhaka' },
]

// Product-specific review templates (All ratings 5 or 4, strictly > 4 average)
const REVIEWS_BY_TYPE = {
  weather: [
    { rating: 5, title: 'Incredible desktop accessory!', body: 'WiFi configuration took less than 2 minutes on my phone. The real-time Dhaka weather, humidity, and temperature updates are super accurate. Looks futuristic beside my mechanical keyboard!' },
    { rating: 5, title: 'Best desk clock in Bangladesh', body: 'The screen is vibrant and crystal clear. You can adjust the brightness so it does not distract you while working at night. Extremely satisfied with ATMODESK delivery!' },
    { rating: 5, title: 'Premium build quality & aesthetics', body: 'Came in safe bubble wrap packaging. Feels solid and looks like a miniature cyberpunk workstation widget. 10/10 recommended for tech setups.' },
    { rating: 5, title: 'Super accurate weather sync', body: 'Weather and temperature sync perfectly. Cash on delivery was seamless and the delivery guy arrived in under 24 hours in Dhanmondi.' },
    { rating: 4, title: 'Very nice smart clock', body: 'Works as advertised. Setup manual was straightforward. The display viewing angles are great. Only wish the USB cable was a bit longer, but otherwise perfect.' },
    { rating: 5, title: 'Minimalist dream', body: 'Replaced my old boring digital clock with this beauty. Having weather and time constantly visible keeps me on schedule while working from home.' },
    { rating: 5, title: 'Clean typography and graphics', body: 'The animated weather icons are delightful. Everyone who visits my home office asks where I got this from. Great service from Atmodesk.' },
    { rating: 5, title: 'Worth every single Taka', body: 'Great build, compact size, and zero lag on WiFi time synchronization. Exactly what my desktop setup was missing.' },
    { rating: 4, title: 'Impressive smart gadget', body: 'Display is very crisp and readable from across the room. Simple setup. Truly satisfied with the fast delivery inside Dhaka.' },
    { rating: 5, title: 'Aesthetic and functional', body: 'The small footprint means it fits right under my monitor without cluttering the desk pad. Highly recommended gadget.' },
  ],
  timer: [
    { rating: 5, title: 'The ultimate Pomodoro productivity tool!', body: 'The gravity flip mechanism is addicting! Just flip to the number (5, 10, 30, 60 mins) and it immediately starts counting down. Boosted my coding focus tenfold.' },
    { rating: 5, title: 'Silent vibration mode is a lifesaver', body: 'I use it in my office and the library without disturbing anyone thanks to the silent vibration mode. USB-C charging holds up for weeks.' },
    { rating: 5, title: 'Clean minimalist cube design', body: 'Matte texture feels premium in hands. Dual mode allows custom countdown or regular stopwatch. Absolutely love this timer.' },
    { rating: 4, title: 'Great focus companion', body: 'Helps me manage study intervals for BCS preparation. Very easy to operate. Flipping to pause and reset is effortless.' },
    { rating: 5, title: 'Much better than using smartphone timers', body: 'Using phone timers always leads to scrolling social media. This dedicated physical cube keeps me locked into deep work.' },
    { rating: 5, title: 'Solid battery life and display', body: 'The LED digits are bright and clear. The gyro sensor is instant. Best desk investment I made this month.' },
    { rating: 5, title: 'Compact & rechargeable', body: 'No hassle of buying AAA batteries. One charge via Type-C lasted almost a whole month of daily use.' },
    { rating: 4, title: 'Very satisfying to flip', body: 'Good build quality. Beep sound is clear and vibration is strong enough to feel on the desk.' },
    { rating: 5, title: 'Top notch productivity gadget', body: 'Fast delivery to Chittagong within 3 days. Item was brand new in sealed box. Highly recommended for students and engineers.' },
    { rating: 5, title: 'Helped reduce my screen time', body: 'Simple, effective, and stylish. It sits right next to my notebook and helps me knock out tasks efficiently.' },
  ],
  alarm: [
    { rating: 5, title: 'Adorable expressions & smart features!', body: 'The facial animations whenever it wakes up or rings are so cute! My daughter is obsessed with it, and it makes waking up in the morning fun.' },
    { rating: 5, title: 'Sound-activated sensor is very responsive', body: 'Just clap or tap the nightstand and the display turns on. The night light has a pleasant warm hue that is easy on the eyes.' },
    { rating: 5, title: 'High quality build & long battery', body: 'Silicone ears feel very soft and premium. Holds charge for several days easily. Accurate room temperature display as well.' },
    { rating: 4, title: 'Lovely bedside companion', body: 'Multiple ringtone options and good volume control. The snooze function works by gently shaking it. Delivered safely to Mirpur.' },
    { rating: 5, title: 'Perfect gift item', body: 'Bought two pieces as gifts for cousins. Packaging was beautiful and devices worked straight out of the box.' },
    { rating: 5, title: 'Gentle night lamp', body: 'The ambient light is perfect for night time reading or as a sleep companion for kids. Excellent value for money.' },
    { rating: 5, title: 'Cute, loud enough, and very aesthetic', body: 'Pleasant alarm sounds that do not startle you. Display shows time, date, and temperature accurately.' },
    { rating: 4, title: 'Very happy with this clock', body: 'Good voice control sensitivity. Cute expressions change dynamically. Customer service on WhatsApp was helpful.' },
    { rating: 5, title: 'Super cute bedside piece', body: 'Bright LED numbers that dim automatically at night. High quality rechargeable battery.' },
    { rating: 5, title: 'Must-have bedside desk tech', body: 'Looks even prettier in person than the photos. 100% recommended for aesthetic bedroom setups.' },
  ],
  general: [
    { rating: 5, title: 'Outstanding desk gadget from ATMODESK!', body: 'From packaging to performance, everything exceeded my expectations. Fast delivery inside Dhaka and great build quality.' },
    { rating: 5, title: 'Premium desktop aesthetics', body: 'Fits my minimalist work from home desk setup beautifully. Sleek design, sturdy materials, and crisp display.' },
    { rating: 5, title: '100% authentic and well packaged', body: 'Received in pristine condition with all accessories included. Support was responsive on WhatsApp.' },
    { rating: 4, title: 'Very good product and quick delivery', body: 'Item matches description and works smoothly. Arrived in 2 days via courier with cash on delivery.' },
    { rating: 5, title: 'Highly recommended for tech lovers', body: 'Super clean design, practical everyday functionality, and reasonable pricing compared to imported gadgets.' },
    { rating: 5, title: 'Satisfied customer', body: 'Will definitely buy more desk gadgets from ATMODESK. Really impressed with the product presentation.' },
  ],
}

async function main() {
  console.log('🚀 Starting review seeding for all active products...')

  // 1. Fetch all products
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true, isActive: true },
  })
  console.log(`📦 Found ${products.length} products in database.`)

  for (const product of products) {
    console.log(`\nProcessing: "${product.name}" (${product.id})`)

    // Clear existing reviews for clean seed
    await prisma.review.deleteMany({ where: { productId: product.id } })

    // Determine product category/flavor for reviews
    const pName = product.name.toLowerCase()
    let templatePool = REVIEWS_BY_TYPE.general
    if (pName.includes('weather') || pName.includes('geekmagic') || pName.includes('wifi')) {
      templatePool = [...REVIEWS_BY_TYPE.weather, ...REVIEWS_BY_TYPE.general]
    } else if (pName.includes('timer') || pName.includes('cube') || pName.includes('pomodoro') || pName.includes('flip')) {
      templatePool = [...REVIEWS_BY_TYPE.timer, ...REVIEWS_BY_TYPE.general]
    } else if (pName.includes('expression') || pName.includes('cute') || pName.includes('alarm')) {
      templatePool = [...REVIEWS_BY_TYPE.alarm, ...REVIEWS_BY_TYPE.general]
    }

    // Target between 42 and 48 reviews per product
    const targetCount = 42 + Math.floor(Math.random() * 7) // 42 to 48 reviews
    console.log(`Seeding ${targetCount} reviews for ${product.name}...`)

    const reviewsToCreate: any[] = []
    let totalScore = 0

    // Pick reviewers up to targetCount
    const selectedReviewers = [...REVIEWERS].sort(() => 0.5 - Math.random()).slice(0, targetCount)

    for (let i = 0; i < selectedReviewers.length; i++) {
      const reviewer = selectedReviewers[i]
      const template = templatePool[i % templatePool.length]

      // Rating: predominantly 5 (85%), occasionally 4 (15%), strictly >= 4
      const rating = Math.random() < 0.85 ? 5 : 4
      totalScore += rating

      // Date spread over the last 150 days
      const daysAgo = Math.floor(Math.random() * 150) + 1
      const reviewDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

      reviewsToCreate.push({
        productId: product.id,
        authorName: reviewer.name,
        rating,
        title: template.title,
        body: template.body,
        isVerified: true,
        isApproved: true,
        createdAt: reviewDate,
        updatedAt: reviewDate,
      })
    }

    // Insert reviews into database
    await prisma.review.createMany({
      data: reviewsToCreate,
      skipDuplicates: true,
    })

    const finalCount = reviewsToCreate.length
    const avgRating = Math.round((totalScore / finalCount) * 10) / 10

    // Update Product record
    await prisma.product.update({
      where: { id: product.id },
      data: {
        reviewCount: finalCount,
        rating: avgRating,
      },
    })

    console.log(`✅ Seeded ${finalCount} reviews! New Rating: ${avgRating}★`)
  }

  console.log('\n🎉 Successfully finished seeding 40-50 reviews for all products! All reviews > 4★.')
}

main()
  .catch((e) => {
    console.error('Error seeding reviews:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
