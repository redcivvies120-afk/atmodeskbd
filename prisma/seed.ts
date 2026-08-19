// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding expanded Atmodeskbd database...')

  // ── Admin user ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@atmodeskbd.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@atmodeskbd.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Admin user:', admin.email)

  // ── Demo customer ────────────────────────────────────────────
  const customerPassword = await bcrypt.hash('Customer@123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@atmodeskbd.com' },
    update: {},
    create: {
      name: 'Rahim Ahmed',
      email: 'customer@atmodeskbd.com',
      phone: '01712345678',
      password: customerPassword,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  })
  console.log('✅ Customer user:', customer.email)

  // ── Shipping methods ─────────────────────────────────────────
  await prisma.shippingMethod.deleteMany()
  await Promise.all([
    prisma.shippingMethod.create({
      data: { name: 'Inside Dhaka', description: 'Delivery within Dhaka city (24-48h)', price: 60, freeAbove: 2000, estimatedDays: '1-2 days', sortOrder: 1 },
    }),
    prisma.shippingMethod.create({
      data: { name: 'Outside Dhaka', description: 'Nationwide courier (3-5 days)', price: 120, freeAbove: 3500, estimatedDays: '3-5 days', sortOrder: 2 },
    }),
    prisma.shippingMethod.create({
      data: { name: 'Express Same-Day Dhaka', description: 'Express delivery inside Dhaka within 6 hours', price: 180, estimatedDays: 'Same day', sortOrder: 3 },
    }),
  ])
  console.log('✅ Shipping methods seeded')

  // ── Categories ───────────────────────────────────────────────
  await prisma.category.deleteMany()
  const catClocks = await prisma.category.create({
    data: { name: 'Smart Clocks', slug: 'smart-clocks', description: 'WiFi LED matrix clocks & retro displays', sortOrder: 1 },
  })
  const catWeather = await prisma.category.create({
    data: { name: 'Weather Stations', slug: 'weather-stations', description: 'Indoor & outdoor climate displays & AQI monitors', sortOrder: 2 },
  })
  const catAudio = await prisma.category.create({
    data: { name: 'Audio & Earbuds', slug: 'audio', description: 'TWS earbuds, IEMs, desktop DACs & speakers', sortOrder: 3 },
  })
  const catDesk = await prisma.category.create({
    data: { name: 'Desk Tech & Hubs', slug: 'desk-tech', description: 'USB-C docks, laptop stands, cable organizers', sortOrder: 4 },
  })
  const catLights = await prisma.category.create({
    data: { name: 'Ambient Lights', slug: 'ambient-lights', description: 'RGB lightbars, neon tubes, moon lamps', sortOrder: 5 },
  })
  const catPower = await prisma.category.create({
    data: { name: 'Power & Chargers', slug: 'power-chargers', description: 'Fast GaN chargers, power banks, wireless pads', sortOrder: 6 },
  })

  console.log('✅ Categories seeded')

  // ── Brands ───────────────────────────────────────────────────
  await prisma.brand.deleteMany()
  const bAtmo = await prisma.brand.create({ data: { name: 'AtmoDesk', slug: 'atmodesk' } })
  const bPixel = await prisma.brand.create({ data: { name: 'PixelTech', slug: 'pixeltech' } })
  const bAnker = await prisma.brand.create({ data: { name: 'Anker', slug: 'anker' } })
  const bBaseus = await prisma.brand.create({ data: { name: 'Baseus', slug: 'baseus' } })
  const bQCY = await prisma.brand.create({ data: { name: 'QCY', slug: 'qcy' } })
  console.log('✅ Brands seeded')

  // ── Products ─────────────────────────────────────────────────
  await prisma.productSpec.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()

  const productsList = [
    {
      sku: 'ATD-101', name: 'Pixel Weather Clock Pro 64×32 RGB', slug: 'pixel-weather-clock-pro',
      description: 'A stunning 64×32 LED matrix desktop clock with real-time Dhaka weather data via WiFi. Displays time, temperature, humidity, AQI, and animated pixel art.',
      details: '• 64×32 RGB Full-Color LED Matrix\n• WiFi connected — pulls live Bangladesh weather\n• 12 customizable animated clock faces\n• Shows Dhaka Temp, Humidity, PM2.5 AQI\n• Compatible with Android & iOS companion app\n• USB-C powered (cable & adapter included)\n• English firmware — plug & play',
      categoryId: catClocks.id, brandId: bAtmo.id,
      price: 2999, originalPrice: 4999, stock: 45,
      isFeatured: true, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&q=80'],
      specs: [['Display', '64×32 RGB Matrix'], ['Connectivity', 'WiFi 2.4GHz'], ['Power', 'USB-C 5V/2A'], ['Warranty', '6 Months Service Warranty']],
    },
    {
      sku: 'ATD-102', name: 'Vintage Mechanical Flip Clock (Auto Date)', slug: 'vintage-mechanical-flip-clock',
      description: 'Satisfying mechanical flip display clock bringing retro mid-century charm to any workstation. Shows hour, minute, AM/PM, and calendar.',
      details: '• Genuine mechanical gear-driven flip tiles\n• High-precision quartz movement\n• Built-in soft LED night accent\n• Operates on 1× D Battery or USB-C\n• Matte black powder-coated steel frame\n• Whisper quiet gear mechanism',
      categoryId: catClocks.id, brandId: bPixel.id,
      price: 2499, originalPrice: 3500, stock: 30,
      isFeatured: true, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80'],
      specs: [['Movement', 'Quartz Mechanical Gear'], ['Material', 'Steel Frame + ABS Tiles'], ['Power', 'USB-C / 1× D Battery'], ['Warranty', '6 Months']],
    },
    {
      sku: 'ATD-103', name: 'Nixie-Style Glowing Tube Clock (Walnut Base)', slug: 'nixie-tube-clock-walnut',
      description: 'Six warm amber LED tubes in vintage nixie tube style, mounted on handcrafted genuine walnut wood. RGB mood backlighting with custom digits.',
      details: '• 6 Nixie-style simulated glass tube digits\n• Solid North American Walnut wood base\n• 16 million RGB ambient tube backlighting\n• Light sensor for auto dimming at night\n• Alarm and timer functionality\n• Type-C input (5V)',
      categoryId: catClocks.id, brandId: bAtmo.id,
      price: 4499, originalPrice: 6500, stock: 18,
      isFeatured: true, isBestSeller: false, isNewArrival: true,
      images: ['https://images.unsplash.com/photo-1531171675606-4e5b4cf4277f?w=800&q=80'],
      specs: [['Base', 'Solid Walnut Wood'], ['Display', '6 LED Tubes + Glass Cover'], ['Backlight', '16M RGB'], ['Warranty', '1 Year Official Warranty']],
    },
    {
      sku: 'ATD-104', name: 'IPS Color Desktop Weather Station 3.5"', slug: 'ips-desktop-weather-station',
      description: 'Monitor your room climate with precision. Displays temperature, humidity, atmospheric pressure, and 24-hour weather forecast on a bright 3.5" IPS display.',
      details: '• 3.5" Full-Viewing-Angle IPS Color Screen\n• Swiss high-precision Sensirion sensor\n• Dynamic weather forecast animation\n• Dual power: Rechargeable 2000mAh battery or USB-C\n• Trend indicators for rising/falling climate',
      categoryId: catWeather.id, brandId: bAtmo.id,
      price: 1899, originalPrice: 2800, stock: 50,
      isFeatured: true, isBestSeller: false, isNewArrival: true,
      images: ['https://images.unsplash.com/photo-1504608524841-42584f9b8113?w=800&q=80'],
      specs: [['Display', '3.5" IPS Color Screen'], ['Sensors', 'Swiss Sensirion SHT40'], ['Battery', '2000mAh Lithium'], ['Warranty', '6 Months']],
    },
    {
      sku: 'ATD-105', name: 'Laser AQI & CO2 Air Quality Monitor', slug: 'laser-aqi-co2-monitor',
      description: 'Accurate real-time air quality index tester for Dhaka rooms. Measures PM2.5, PM10, CO2, formaldehyde (HCHO), and temperature.',
      details: '• Laser particle sensor for PM2.5 & PM10\n• NDIR CO2 sensor with color health alert\n• Historical 24h bar graph on 4.3" display\n• Built-in 3000mAh battery for portability\n• Bangladesh standard air quality index mapping',
      categoryId: catWeather.id, brandId: bAtmo.id,
      price: 3799, originalPrice: 5200, stock: 25,
      isFeatured: false, isBestSeller: true, isNewArrival: true,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
      specs: [['Laser Sensor', 'High-Precision Laser Diode'], ['CO2 Range', '400 - 5000 ppm'], ['Battery', '3000mAh (8h)'], ['Warranty', '6 Months']],
    },
    {
      sku: 'ATD-106', name: 'RGB Spectrum Sound-Reactive Light Bar', slug: 'rgb-spectrum-light-bar',
      description: '32-bit ARM processor music visualizer with 32 dynamic multi-color LED segments. Reacts instantly to your voice, music, and gaming audio.',
      details: '• 32 Colorful RGB Lamp Beads\n• 32-bit ARM Cortex M0 processor\n• Built-in ultra-sensitive MEMS microphone\n• 8 display modes + 18 color styles\n• AGC (Automatic Gain Control) algorithm\n• Type-C rechargeable built-in battery',
      categoryId: catLights.id, brandId: bPixel.id,
      price: 1299, originalPrice: 1999, stock: 75,
      isFeatured: false, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80'],
      specs: [['Processor', '32-bit ARM'], ['LEDs', '32 High-Brightness RGB'], ['Input', 'Built-in MEMS Mic + USB-C'], ['Warranty', '3 Months']],
    },
    {
      sku: 'ATD-107', name: 'Anker Soundcore Space A40 ANC Earbuds', slug: 'anker-soundcore-space-a40',
      description: 'Upgraded noise cancelling earbuds with 50-hour playtime, Hi-Res wireless audio, LDAC support, and ultra-comfortable ergonomic fit.',
      details: '• Adaptive Active Noise Cancelling (up to 98% reduction)\n• Hi-Res Audio Wireless certified with LDAC\n• 10 hours on single charge, 50 hours total with case\n• Wireless charging + Fast USB-C charging\n• 6 microphones with AI uplink noise reduction\n• IPX4 water resistance',
      categoryId: catAudio.id, brandId: bAnker.id,
      price: 7499, originalPrice: 9500, stock: 20,
      isFeatured: true, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'],
      specs: [['ANC', 'Adaptive Active Noise Cancelling'], ['Battery', '50 Hours Total'], ['Audio Codec', 'LDAC, AAC, SBC'], ['Warranty', '18 Months Official Anker']],
    },
    {
      sku: 'ATD-108', name: 'QCY ArcBuds HT07 ANC TWS Earbuds', slug: 'qcy-arcbuds-ht07-anc',
      description: 'Budget flagship ANC earbuds featuring 40dB hybrid noise cancelling, 6-mic wind noise reduction, and custom EQ via QCY App.',
      details: '• 40dB Hybrid Active Noise Cancellation\n• 4 ANC modes: Indoor, Commuting, Crowded, Anti-Wind\n• 6 Microphones with ENC Call Quality\n• 32 Hours total battery life\n• Ultra low latency gaming mode (0.08s)\n• QCY App support for custom equalizer',
      categoryId: catAudio.id, brandId: bQCY.id,
      price: 2499, originalPrice: 3200, stock: 60,
      isFeatured: false, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&q=80'],
      specs: [['ANC Depth', '40dB Hybrid ANC'], ['Battery', '32 Hours Total'], ['App Support', 'QCY App (iOS/Android)'], ['Warranty', '6 Months']],
    },
    {
      sku: 'ATD-109', name: 'Baseus 65W GaN5 Pro Fast Charger (3-Port)', slug: 'baseus-65w-gan5-pro-charger',
      description: 'Ultra-compact 65W GaN fast charger with 2× USB-C and 1× USB-A ports. Fast charges MacBooks, iPhones, Samsung, and laptops simultaneously.',
      details: '• GaN5 fifth-generation semiconductor technology\n• 65W Max Power Delivery (PD 3.0 / QC 4.0)\n• BPS II intelligent power distribution across 3 ports\n• Full Bangladesh 220V plug standard\n• Safe multiple thermal protections\n• Includes 100W 1m Type-C cable in box',
      categoryId: catPower.id, brandId: bBaseus.id,
      price: 2399, originalPrice: 3100, stock: 40,
      isFeatured: true, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'],
      specs: [['Power', '65W Max Output'], ['Ports', '2× USB-C + 1× USB-A'], ['Tech', 'GaN5 Pro Technology'], ['Warranty', '6 Months']],
    },
    {
      sku: 'ATD-110', name: 'Baseus 20000mAh 65W Blade Fast Power Bank', slug: 'baseus-20000mah-blade-powerbank',
      description: 'Ultra-thin laptop power bank with 65W output, digital status display, and dual USB-C + dual USB-A fast charging ports.',
      details: '• 65W PD high power output — charges laptops & phones\n• Ultra-slim 18mm thickness for laptop bags\n• Digital LED display shows remaining % & charge time\n• 20,000mAh / 74Wh flight approved capacity\n• 2× USB-C PD + 2× USB-A QC ports',
      categoryId: catPower.id, brandId: bBaseus.id,
      price: 4999, originalPrice: 6500, stock: 22,
      isFeatured: false, isBestSeller: false, isNewArrival: true,
      images: ['https://images.unsplash.com/photo-1609592426815-e2e4bca28eb8?w=800&q=80'],
      specs: [['Capacity', '20,000mAh / 74Wh'], ['Output', '65W USB-C PD'], ['Thickness', '18mm Slim Profile'], ['Warranty', '6 Months']],
    },
    {
      sku: 'ATD-111', name: 'Aluminum 360° Rotating Ergonomic Laptop Stand', slug: 'aluminum-360-rotating-laptop-stand',
      description: 'Heavy-duty CNC aluminum laptop riser with a 360-degree rotating base, dual pivot height adjustment, and heat dissipation vents.',
      details: '• 360° smooth ball-bearing swivel base\n• Dual damping hinges hold up to 10kg without slipping\n• Premium sandblasted aerospace aluminum alloy\n• Non-slip silicone padding protects laptop body\n• Supports 11" to 17.3" laptops & MacBooks\n• Foldable for portability',
      categoryId: catDesk.id, brandId: bAtmo.id,
      price: 2199, originalPrice: 2999, stock: 35,
      isFeatured: false, isBestSeller: true, isNewArrival: false,
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
      specs: [['Material', 'CNC Sandblasted Aluminum'], ['Rotation', '360-Degree Swivel'], ['Compatibility', '11 to 17.3 inch laptops'], ['Warranty', '1 Year Replacement']],
    },
    {
      sku: 'ATD-112', name: 'Smart 10-in-1 USB-C Hub & Desktop Docking Station', slug: 'smart-10-in-1-usbc-dock',
      description: 'Expand your laptop with 4K HDMI, Gigabit Ethernet, 100W PD charging, SD/TF card readers, 3× USB 3.0, and 3.5mm audio jack.',
      details: '• 4K @ 60Hz HDMI video output\n• 100W USB-C Power Delivery pass-through\n• 1000Mbps Gigabit RJ45 LAN port\n• 3× USB-A 3.0 (5Gbps high-speed data)\n• SD and MicroSD UHS-I card readers\n• Sleek aluminum housing for heat dissipation',
      categoryId: catDesk.id, brandId: bAtmo.id,
      price: 3499, originalPrice: 4800, stock: 28,
      isFeatured: true, isBestSeller: false, isNewArrival: true,
      images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80'],
      specs: [['HDMI', '4K @ 60Hz'], ['Ethernet', '1000Mbps Gigabit'], ['Power', '100W PD Pass-through'], ['Warranty', '1 Year Official']],
    },
  ]

  for (const p of productsList) {
    const { images, specs, ...productData } = p
    const product = await prisma.product.create({
      data: {
        ...productData,
        discount: productData.originalPrice
          ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
          : 0,
        rating: Math.round((4.2 + Math.random() * 0.7) * 10) / 10,
        reviewCount: Math.floor(Math.random() * 150 + 25),
        soldCount: Math.floor(Math.random() * 400 + 40),
      },
    })

    // Images
    await prisma.productImage.create({
      data: { productId: product.id, url: images[0], isPrimary: true, sortOrder: 0 },
    })

    // Specs
    for (const [key, value] of specs) {
      await prisma.productSpec.create({ data: { productId: product.id, key, value } })
    }
  }
  console.log(`✅ ${productsList.length} products seeded`)

  // ── Coupons ──────────────────────────────────────────────────
  await prisma.coupon.deleteMany()
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, description: 'Welcome 10% off for all customers', minOrderAmount: 500, isActive: true },
      { code: 'FLAT200', type: 'FIXED', value: 200, description: '৳200 flat discount on orders above ৳2,000', minOrderAmount: 2000, isActive: true },
      { code: 'GADGET500', type: 'FIXED', value: 500, description: '৳500 flat discount on orders above ৳5,000', minOrderAmount: 5000, isActive: true },
    ],
  })
  console.log('✅ Coupons seeded')

  console.log('\n🎉 Database re-seeded with Gadget Breeze style categories!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
