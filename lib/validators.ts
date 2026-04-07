import { z } from 'zod';

export const buildSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  category: z.string().min(2),
  subcategory: z.string().optional().or(z.literal('')),
  discipline: z.string().optional().or(z.literal('')),
  chassisType: z.string().optional().or(z.literal('')),
  caliber: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal('')),
  specificationsText: z.string().min(2),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional()
});

export const championSchema = z.object({
  name: z.string().min(2),
  title: z.string().min(2),
  quote: z.string().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  achievements: z.string().min(2),
  loadout: z.string().optional().or(z.literal('')),
  featured: z.boolean().optional()
});

export const blogPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(20),
  excerpt: z.string().min(10),
  slug: z.string().min(3),
  category: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal('')),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  author: z.string().min(2),
  published: z.boolean().optional()
});

export const pressItemSchema = z.object({
  title: z.string().min(3),
  publication: z.string().min(2),
  url: z.string().url(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  publishedAt: z.string().min(1),
  category: z.string().min(2),
  featured: z.boolean().optional()
});


export const orderSchema = z.object({
  orderType: z.string().min(1),
  selectedSystem: z.string().min(1),
  subcategory: z.string().optional(),
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  shippingAddress: z.string().min(8),
  caliber: z.string().optional(),
  handedness: z.enum(['Right', 'Left']).optional().or(z.literal('')),
  finishColor: z.string().optional(),
  discipline: z.string().optional(),
  options: z.string().optional(),
  specialInstructions: z.string().optional(),
  notes: z.string().optional()
});

export const settingsSchema = z.object({
  notificationEmail: z.string().email()
});

export const heroSchema = z.object({
  headline: z.string().min(2),
  subheadline: z.string().min(10),
  ctaButtonText: z.string().min(2),
  ctaButtonUrl: z.string().min(1),
  backgroundImage: z.string().url().optional().or(z.literal(''))
});
