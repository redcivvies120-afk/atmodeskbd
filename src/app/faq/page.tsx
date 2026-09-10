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
  PhoneCall,
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
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    items: [
      {
        id: 'ord-1',
        question: 'How do I place an order?',
        answer:
          "Browse products, add to cart, go to checkout, fill in your details and confirm. It's that simple!",
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
    iconColor: 'text-sky-500',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    items: [
      {
        id: 'shp-1',
        question: 'How long does delivery take?',
        answer: 'Inside Dhaka: 24-48 hours. Outside Dhaka: 3-5 business days.',
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
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    items: [
      {
        id: 'ret-1',
        question: 'What is your return policy?',
        answer:
          '7-day replacement policy for defective products. Contact us via Messenger to initiate a return.',
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
          'Message us on Facebook Messenger (m.me/atmodeskbd) with your Order ID and reason for return.',
        links: [
          { label: 'm.me/atmodeskbd', href: 'https://m.me/atmodeskbd', external: true },
        ],
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    description: 'Product authenticity, WiFi connectivity, and damage protection.',
    icon: Sparkles,
    iconColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    items: [
      {
        id: 'prd-1',
        question: 'Are your products authentic?',
        answer: 'Yes, all products are sourced directly from verified global manufacturers.',
      },
      {
        id: 'prd-2',
        question: 'Do smart clocks need WiFi?',
        answer:
          'Most smart clocks connect via 2.4GHz WiFi for weather, time sync, and display features.',
      },
      {
        id: 'prd-3',
        question: 'What if my product arrives damaged?',
        answer:
          "Contact us immediately on WhatsApp with photos. We'll arrange a free replacement.",
        links: [
          { label: 'WhatsApp +880 1318-043562', href: 'https://wa.me/8801318043562', external: true },
        ],
      },
    ],
  },
]

export default function FAQPage() {
  // Track open items (default: first item in each category open)
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'ord-1': true,
    'shp-1': true,
    'ret-1': true,
    'prd-1': true,
  })

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Toggle single accordion
  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Expand all or Collapse all
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

  // Filtered categories and questions based on category tab & search query
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return FAQ_DATA.map((cat) => {
      // Check category match
      const categoryMatches = selectedCategory === 'all' || cat.id === selectedCategory

      if (!categoryMatches) {
        return { ...cat, items: [] }
      }

      if (!query) {
        return cat
      }

      // Filter items matching query
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
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* ─── 1. HERO SECTION ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-14 pb-20 md:py-24">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-400 text-xs font-semibold backdrop-blur-md">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ATMODESK Help Center &amp; FAQ</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Frequently Asked{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-amber-300">
                Questions
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Got questions about our smart clocks, Cash on Delivery, Dhaka shipping timelines, or 7-day replacements?
              Find quick answers below.
            </p>

            {/* Live Search Input Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions (e.g., payment, delivery charge, wifi, warranty)..."
                  className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:bg-white/15 focus:outline-hidden focus:ring-2 focus:ring-sky-400 transition shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN ACCORDION CONTENT ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Tabs & Expand Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {FAQ_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.title}</span>
              </button>
            ))}
          </div>

          {/* Expand / Collapse All */}
          <div className="flex items-center gap-2 flex-shrink-0 text-xs text-slate-500">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 font-semibold transition"
            >
              Expand All
            </button>
            <span>·</span>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 font-semibold transition"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search status indicator if searching */}
        {searchQuery && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-800">
            <span>
              Showing <strong>{totalMatchingQuestions}</strong> result{totalMatchingQuestions === 1 ? '' : 's'} for &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="font-bold underline hover:text-sky-950"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-3xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No matching questions found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any answer matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or message us directly.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Reset Search
              </button>
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
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
                  <div className={`w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center ${category.iconColor}`}>
                    <CatIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {category.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                  </div>
                </div>

                {/* Questions Accordion Group */}
                <div className="space-y-3">
                  {category.items.map((item) => {
                    const isOpen = !!openItems[item.id]

                    return (
                      <div
                        key={item.id}
                        className={`bg-white border transition-all duration-200 rounded-2xl overflow-hidden ${
                          isOpen
                            ? 'border-sky-500/50 shadow-sm ring-1 ring-sky-500/20'
                            : 'border-slate-200/90 hover:border-slate-300 shadow-2xs'
                        }`}
                      >
                        {/* Question Button */}
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isOpen}
                          className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left cursor-pointer transition select-none group"
                        >
                          <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {item.question}
                          </span>

                          {/* + / - Icon */}
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                              isOpen
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                            }`}
                          >
                            {isOpen ? (
                              <Minus className="w-4 h-4 stroke-[2.5]" />
                            ) : (
                              <Plus className="w-4 h-4 stroke-[2.5]" />
                            )}
                          </div>
                        </button>

                        {/* Answer Content */}
                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/40 space-y-3 animate-fade-in">
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
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs border border-sky-200 transition"
                                    >
                                      <span>{link.label}</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </a>
                                  ) : (
                                    <Link
                                      key={link.label}
                                      href={link.href}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition"
                                    >
                                      <span>{link.label}</span>
                                      <ChevronRight className="w-3 h-3" />
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

      {/* ─── 3. STILL NEED HELP CTA BANNER ─────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2.5">
              <span className="px-3 py-1 bg-white/10 text-sky-400 font-bold text-xs rounded-full uppercase tracking-wider backdrop-blur-xs">
                Still Have Questions?
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                We&apos;re Just a Message Away
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Can&apos;t find what you are looking for? Our friendly team in New Eskaton, Dhaka is ready to assist you
                with product choices, technical support, or delivery updates.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2.5">
              <a
                href="https://wa.me/8801318043562"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition text-center"
              >
                <span>📱</span>
                <span>WhatsApp (+880 1318-043562)</span>
              </a>

              <a
                href="https://m.me/atmodeskbd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Message on Facebook</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition text-center"
              >
                <span>Visit Contact Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
