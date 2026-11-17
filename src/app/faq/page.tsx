// src/app/faq/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  Search,
  Plus,
  Minus,
  CreditCard,
  Truck,
  RotateCcw,
  Clock,
  Sparkles,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  links?: { label: string; href: string; external?: boolean }[]
}

interface FAQCategory {
  id: string
  title: string
  description: string
  icon: React.ElementType
  iconColor: string
  badgeBg: string
  items: FAQItem[]
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'ordering-payment',
    title: 'Ordering & Payment',
    description: 'Placing orders, Cash on Delivery terms, and order modifications.',
    icon: CreditCard,
    iconColor: 'text-amber-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    items: [
      {
        id: 'ord-1',
        question: 'How do I place an order?',
        answer:
          "Browse products, add to cart, go to checkout, fill in your details and confirm. It's that simple! No prepayment required.",
        links: [
          { label: 'Browse Products', href: '/products' },
          { label: 'View Cart', href: '/cart' },
        ],
      },
      {
        id: 'ord-2',
        question: 'What payment methods do you accept?',
        answer:
          'We currently accept Cash on Delivery (COD) only. Pay in cash when your order arrives at your doorstep.',
      },
      {
        id: 'ord-3',
        question: 'Can I cancel my order?',
        answer:
          'Yes, you can cancel before the order is shipped. Contact us on WhatsApp or Messenger.',
        links: [
          { label: 'Chat on WhatsApp', href: 'https://wa.me/8801318043562', external: true },
          { label: 'Message on Facebook', href: 'https://m.me/atmodeskbd', external: true },
        ],
      },
      {
        id: 'ord-4',
        question: 'Is there a minimum order amount?',
        answer: 'No minimum order. You can order any single product.',
      },
    ],
  },
  {
    id: 'shipping-delivery',
    title: 'Shipping & Delivery',
    description: 'Transit times, shipping rates, coverage, and tracking parcels.',
    icon: Truck,
    iconColor: 'text-[#0077C8]',
    badgeBg: 'bg-sky-50 text-[#0077C8] border-sky-200/60',
    items: [
      {
        id: 'shp-1',
        question: 'How long does delivery take?',
        answer: 'Inside Dhaka: 24-48 hours. Outside Dhaka: 3-5 business days across all 64 districts.',
      },
      {
        id: 'shp-2',
        question: 'How much is the delivery charge?',
        answer:
          'Dhaka: ৳60-80. Outside Dhaka: ৳100-150. Free delivery on orders above ৳2,000 inside Dhaka.',
      },
      {
        id: 'shp-3',
        question: 'Do you deliver outside Bangladesh?',
        answer: 'Currently we only deliver within Bangladesh.',
      },
      {
        id: 'shp-4',
        question: 'How can I track my order?',
        answer: 'Visit our Track Order page or contact us on WhatsApp with your Order ID.',
        links: [
          { label: 'Track Order Page', href: '/track-order' },
          { label: 'WhatsApp Helpline', href: 'https://wa.me/8801318043562', external: true },
        ],
      },
    ],
  },
  {
    id: 'returns-warranty',
    title: 'Returns & Warranty',
    description: 'Our 7-day replacement policy, warranty claims, and returns process.',
    icon: RotateCcw,
    iconColor: 'text-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60',
    items: [
      {
        id: 'ret-1',
        question: 'What is your return policy?',
        answer:
          '7-day replacement policy for defective products. Contact us via Messenger or WhatsApp to initiate a return.',
        links: [
          { label: 'Read Return Policy', href: '/returns' },
          { label: 'Open Messenger Chat', href: 'https://m.me/atmodeskbd', external: true },
        ],
      },
      {
        id: 'ret-2',
        question: 'Do your products come with warranty?',
        answer: 'Yes, all products come with manufacturer warranty. Duration varies by product.',
      },
      {
        id: 'ret-3',
        question: 'How do I return a product?',
        answer:
          'Message us on Facebook Messenger (m.me/atmodeskbd) or WhatsApp with your Order ID and reason for return.',
        links: [
          { label: 'm.me/atmodeskbd', href: 'https://m.me/atmodeskbd', external: true },
        ],
      },
    ],
  },
  {
    id: 'products',
    title: 'Products & Technology',
    description: 'Product authenticity, WiFi connectivity, and damage protection.',
    icon: Sparkles,
    iconColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    items: [
      {
        id: 'prd-1',
        question: 'Are your products authentic?',
        answer: 'Yes, all products are sourced directly from verified global OEM manufacturers.',
      },
      {
        id: 'prd-2',
        question: 'Do smart clocks need WiFi?',
        answer:
          'Most smart clocks connect via 2.4GHz WiFi for weather, BST time sync, and dynamic display features.',
      },
      {
        id: 'prd-3',
        question: 'What if my product arrives damaged?',
        answer:
          "Contact us immediately on WhatsApp with photos or an unboxing video. We'll arrange a free replacement.",
        links: [
          { label: 'WhatsApp +880 1318-043562', href: 'https://wa.me/8801318043562', external: true },
        ],
      },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'ord-1': true,
    'shp-1': true,
    'ret-1': true,
    'prd-1': true,
  })

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAll = () => {
    const allIds: Record<string, boolean> = {}
    FAQ_DATA.forEach((category) => {
      category.items.forEach((item) => {
        allIds[item.id] = true
      })
    })
    setOpenItems(allIds)
  }

  const collapseAll = () => {
    setOpenItems({})
  }

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return FAQ_DATA.map((cat) => {
      const categoryMatches = selectedCategory === 'all' || cat.id === selectedCategory

      if (!categoryMatches) {
        return { ...cat, items: [] }
      }

      if (!query) {
        return cat
      }

      const matchingItems = cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      )

      return {
        ...cat,
        items: matchingItems,
      }
    }).filter((cat) => cat.items.length > 0)
  }, [selectedCategory, searchQuery])

  const totalMatchingQuestions = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)
  }, [filteredCategories])

  return (
    <div className="space-y-12 sm:space-y-16 pb-20 bg-[#fafafa]">
      {/* --- 1. HERO SECTION (Apple Liquid Glass) ---------------- */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-10 sm:pb-14" aria-label="FAQ Hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-white via-[#f8f9fa] to-sky-50/50 border border-black/[0.08] p-8 sm:p-14 shadow-xs overflow-hidden">
            {/* Ambient specular glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0077C8]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0077C8]/10 border border-[#0077C8]/20 text-[#0077C8] text-xs font-bold uppercase tracking-wider shadow-xs">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>ATMODESK Help Center &amp; FAQ</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0F2138] leading-[1.08]">
                Frequently Asked{' '}
                <span className="text-[#0077C8]">
                  Questions
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#5B6B80] leading-relaxed max-w-2xl mx-auto">
                Got questions about our smart clocks, Cash on Delivery, Dhaka shipping timelines, or 7-day replacements?
                Find quick answers below.
              </p>

              {/* Live Search Input Bar */}
              <div className="pt-2 max-w-xl mx-auto">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#86868b] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions (e.g., payment, delivery, wifi, warranty)..."
                    className="w-full pl-11 pr-10 py-3.5 rounded-full bg-white border border-black/[0.08] text-[#0F2138] placeholder:text-[#86868b] text-sm focus:border-[#0077C8] focus:shadow-[0_0_0_3px_rgba(0,113,227,0.16)] outline-hidden transition shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#86868b] hover:text-[#0F2138] transition"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. MAIN ACCORDION CONTENT --------------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Tabs & Expand Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-[#0077C8] text-white shadow-xs'
                  : 'bg-white text-[#5B6B80] border border-black/[0.08] hover:bg-[#F3F7FB]'
              }`}
            >
              All Categories
            </button>
            {FAQ_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0077C8] text-white shadow-xs'
                    : 'bg-white text-[#5B6B80] border border-black/[0.08] hover:bg-[#F3F7FB]'
                }`}
              >
                <span>{cat.title}</span>
              </button>
            ))}
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-2 flex-shrink-0 text-xs text-[#86868b]">
            <button
              onClick={expandAll}
              className="px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white hover:bg-[#F3F7FB] text-[#0F2138] font-semibold transition shadow-2xs"
            >
              Expand All
            </button>
            <span>·</span>
            <button
              onClick={collapseAll}
              className="px-3.5 py-1.5 rounded-full border border-black/[0.08] bg-white hover:bg-[#F3F7FB] text-[#0F2138] font-semibold transition shadow-2xs"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search status indicator if searching */}
        {searchQuery && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0077C8]/10 border border-[#0077C8]/20 text-xs text-[#0077C8]">
            <span>
              Showing <strong>{totalMatchingQuestions}</strong> result{totalMatchingQuestions === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="font-bold underline hover:text-[#0051a8]"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="liquid-glass-card text-center py-16 px-4 bg-white border border-black/[0.08] rounded-[28px] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#F3F7FB] text-[#86868b] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2138]">No matching questions found</h3>
            <p className="text-xs sm:text-sm text-[#5B6B80] max-w-sm mx-auto">
              We couldn&apos;t find any answer matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or message us directly on WhatsApp.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setSearchQuery('')}
                className="px-5 py-2.5 rounded-full bg-[#0F2138] text-white text-xs font-bold hover:bg-[#0077C8] transition"
              >
                Reset Search
              </button>
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Categories & Accordions List */}
        <div className="space-y-10">
          {filteredCategories.map((category) => {
            const CatIcon = category.icon

            return (
              <div key={category.id} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-10 h-10 rounded-2xl bg-white border border-black/[0.06] flex items-center justify-center shadow-xs ${category.iconColor}`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#0F2138] tracking-tight">
                      {category.title}
                    </h2>
                    <p className="text-xs text-[#5B6B80] mt-0.5">{category.description}</p>
                  </div>
                </div>

                {/* Questions Accordion Group */}
                <div className="space-y-3">
                  {category.items.map((item) => {
                    const isOpen = !!openItems[item.id]

                    return (
                      <div
                        key={item.id}
                        className={`liquid-glass-card bg-white border transition-all duration-200 rounded-[22px] overflow-hidden ${
                          isOpen
                            ? 'border-[#0077C8]/40 shadow-sm ring-1 ring-[#0077C8]/20'
                            : 'border-black/[0.08] hover:border-black/[0.15] shadow-xs'
                        }`}
                      >
                        {/* Question Button */}
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isOpen}
                          className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer transition select-none group"
                        >
                          <span className="text-sm sm:text-base font-bold text-[#0F2138] group-hover:text-[#0077C8] transition-colors">
                            {item.question}
                          </span>

                          {/* + / - Icon */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isOpen
                                ? 'bg-[#0077C8] text-white'
                                : 'bg-[#F3F7FB] text-[#5B6B80] group-hover:bg-black/10'
                            }`}
                          >
                            {isOpen ? (
                              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </div>
                        </button>

                        {/* Answer Content */}
                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-5 pt-1 text-[#5B6B80] text-xs sm:text-sm leading-relaxed border-t border-black/[0.05] bg-[#fafafa] space-y-3 animate-fade-in">
                            <p>{item.answer}</p>

                            {/* Optional Helpful Links */}
                            {item.links && item.links.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {item.links.map((link) =>
                                  link.external ? (
                                    <a
                                      key={link.label}
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-[#0077C8] font-bold text-xs border border-sky-200/50 transition"
                                    >
                                      <span>{link.label}</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <Link
                                      key={link.label}
                                      href={link.href}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F3F7FB] text-[#0F2138] font-bold text-xs border border-black/[0.08] transition shadow-2xs"
                                    >
                                      <span>{link.label}</span>
                                      <ChevronRight className="w-3 h-3 text-[#86868b]" />
                                    </Link>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* --- 3. STILL NEED HELP CTA BANNER ----------------------- */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-black/[0.08] rounded-[32px] sm:rounded-[36px] p-8 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <span className="px-3.5 py-1 bg-[#0077C8]/10 text-[#0077C8] font-bold text-xs rounded-full uppercase tracking-wider">
                Still Have Questions?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F2138] tracking-tight">
                We&apos;re Just a Message Away
              </h3>
              <p className="text-xs sm:text-sm text-[#5B6B80] leading-relaxed max-w-xl">
                Can&apos;t find what you are looking for? Our friendly team in New Eskaton, Dhaka is ready to assist you
                with product choices, technical support, or delivery updates.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5">
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition hover:scale-[1.02] active:scale-95 text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+880 1318-043562)</span>
              </a>

              <a
                href="https://m.me/atmodeskbd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0077C8] hover:bg-[#0066AD] text-white font-bold text-xs shadow-sm transition hover:scale-[1.02] active:scale-95 text-center"
              >
                <span>Message on Facebook</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F3F7FB] text-[#0F2138] font-semibold text-xs border border-black/[0.08] transition text-center shadow-2xs"
              >
                <span>Visit Contact Page</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#5B6B80]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
