// src/lib/validations.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+?880|0)?1[3-9]\d{8}$/, 'Invalid Bangladesh phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Must contain an uppercase letter').regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const addressSchema = z.object({
  label: z.string().default('Home'),
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^(\+?880|0)?1[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  area: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  isDefault: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^(\+?880|0)?1[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  area: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  shippingMethodId: z.string().min(1, 'Select a shipping method'),
  paymentMethod: z.enum(['COD', 'BKASH', 'NAGAD', 'CARD']),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name required'),
  sku: z.string().min(1, 'SKU required'),
  description: z.string().optional(),
  details: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  originalPrice: z.number().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isActive: z.boolean().default(true),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
})

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
})

export const couponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minOrderAmount: z.number().optional(),
  maxDiscount: z.number().optional(),
  usageLimit: z.number().int().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Category name required'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})
