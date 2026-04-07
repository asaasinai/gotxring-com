'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

import { clearAdminSession, createAdminSession, requireAdminSession, verifyAdminLogin } from '@/lib/auth';
import { sendOrderEmails } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { uploadImageFromFormData } from '@/lib/upload';
import {
  blogPostSchema,
  buildSchema,
  championSchema,
  heroSchema,
  orderSchema,
  pressItemSchema,
  rssFeedSchema,
  settingsSchema
} from '@/lib/validators';

function asBoolean(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true' || value === '1';
}

function asString(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getOptionalFile(value: FormDataEntryValue | null): File | null {
  if (!value || typeof value === 'string') {
    return null;
  }
  return value;
}

async function resolveImageUrl(formData: FormData, fieldName: string): Promise<string> {
  const uploaded = await uploadImageFromFormData(getOptionalFile(formData.get(fieldName)));
  if (uploaded) {
    return uploaded;
  }
  return asString(formData.get(`${fieldName}Url`));
}

export async function adminLoginAction(formData: FormData): Promise<{ error?: string }> {
  const username = asString(formData.get('username'));
  const password = asString(formData.get('password'));
  const valid = await verifyAdminLogin(username, password);

  if (!valid) {
    return { error: 'Invalid credentials.' };
  }

  await createAdminSession(username);
  revalidatePath('/admin');
  return {};
}

export async function adminLogoutAction(): Promise<void> {
  clearAdminSession();
  revalidatePath('/admin');
}

export async function upsertBuildAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const imageUrl = await resolveImageUrl(formData, 'image');
  const parsed = buildSchema.parse({
    name: asString(formData.get('name')),
    description: asString(formData.get('description')),
    category: asString(formData.get('category')),
    subcategory: asString(formData.get('subcategory')),
    discipline: asString(formData.get('discipline')),
    chassisType: asString(formData.get('chassisType')),
    caliber: asString(formData.get('caliber')),
    imageUrl,
    specificationsText: asString(formData.get('specificationsText')),
    featured: asBoolean(formData.get('featured')),
    sortOrder: parseInt(asString(formData.get('sortOrder')) || '0', 10)
  });

  let specifications: Prisma.InputJsonValue;
  try {
    specifications = JSON.parse(parsed.specificationsText) as Prisma.InputJsonValue;
  } catch {
    throw new Error('Specifications must be valid JSON.');
  }

  const data = {
    name: parsed.name,
    description: parsed.description,
    category: parsed.category,
    subcategory: parsed.subcategory || '',
    discipline: parsed.discipline || '',
    chassisType: parsed.chassisType || '',
    caliber: parsed.caliber,
    imageUrl: parsed.imageUrl || null,
    specifications,
    featured: parsed.featured ?? false,
    sortOrder: parsed.sortOrder ?? 0
  };

  if (id) {
    await prisma.build.update({ where: { id }, data });
  } else {
    await prisma.build.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/builds');
  revalidatePath('/admin/builds');
}

export async function deleteBuildAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }
  await prisma.build.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/builds');
  revalidatePath('/admin/builds');
}

export async function upsertChampionAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const imageUrl = await resolveImageUrl(formData, 'image');
  const parsed = championSchema.parse({
    name: asString(formData.get('name')),
    title: asString(formData.get('title')),
    quote: asString(formData.get('quote')),
    imageUrl,
    achievements: asString(formData.get('achievements')),
    loadout: asString(formData.get('loadout')),
    featured: asBoolean(formData.get('featured'))
  });

  const data = {
    name: parsed.name,
    title: parsed.title,
    quote: parsed.quote,
    imageUrl: parsed.imageUrl || null,
    achievements: parsed.achievements,
    loadout: parsed.loadout,
    featured: parsed.featured ?? false
  };

  if (id) {
    await prisma.champion.update({ where: { id }, data });
  } else {
    await prisma.champion.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/admin/champions');
}

export async function deleteChampionAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }
  await prisma.champion.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/champions');
}

export async function upsertBlogPostAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const imageUrl = await resolveImageUrl(formData, 'image');
  const parsed = blogPostSchema.parse({
    title: asString(formData.get('title')),
    content: asString(formData.get('content')),
    excerpt: asString(formData.get('excerpt')),
    slug: asString(formData.get('slug')),
    category: asString(formData.get('category')),
    imageUrl,
    sourceUrl: asString(formData.get('sourceUrl')),
    author: asString(formData.get('author')),
    published: asBoolean(formData.get('published'))
  });

  const data = {
    title: parsed.title,
    content: parsed.content,
    excerpt: parsed.excerpt,
    slug: parsed.slug,
    category: parsed.category,
    imageUrl: parsed.imageUrl || null,
    sourceUrl: parsed.sourceUrl || null,
    author: parsed.author,
    published: parsed.published ?? false,
    publishedAt: parsed.published ? new Date() : null
  };

  if (id) {
    await prisma.blogPost.update({ where: { id }, data });
  } else {
    await prisma.blogPost.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/admin/blog-posts');
}

export async function deleteBlogPostAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/blog');
  revalidatePath('/admin/blog-posts');
}

export async function upsertPressItemAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const imageUrl = await resolveImageUrl(formData, 'image');
  const parsed = pressItemSchema.parse({
    title: asString(formData.get('title')),
    publication: asString(formData.get('publication')),
    url: asString(formData.get('url')),
    imageUrl,
    publishedAt: asString(formData.get('publishedAt')),
    category: asString(formData.get('category')),
    featured: asBoolean(formData.get('featured'))
  });

  const data = {
    title: parsed.title,
    publication: parsed.publication,
    url: parsed.url,
    imageUrl: parsed.imageUrl || null,
    publishedAt: new Date(parsed.publishedAt),
    category: parsed.category,
    featured: parsed.featured ?? false
  };

  if (id) {
    await prisma.pressItem.update({ where: { id }, data });
  } else {
    await prisma.pressItem.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/admin/press-items');
}

export async function deletePressItemAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }
  await prisma.pressItem.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/admin/press-items');
}

export async function upsertRssFeedAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const parsed = rssFeedSchema.parse({
    name: asString(formData.get('name')),
    url: asString(formData.get('url')),
    category: asString(formData.get('category')),
    active: asBoolean(formData.get('active'))
  });

  const data = {
    name: parsed.name,
    url: parsed.url,
    category: parsed.category,
    active: parsed.active ?? false
  };

  if (id) {
    await prisma.rssFeed.update({ where: { id }, data });
  } else {
    await prisma.rssFeed.create({ data });
  }

  revalidatePath('/admin/rss-feeds');
}

export async function deleteRssFeedAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }
  await prisma.rssFeed.delete({ where: { id } });
  revalidatePath('/admin/rss-feeds');
}

export async function updateOrderAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: asString(formData.get('status')) || 'Pending',
      notes: asString(formData.get('notes')) || null
    }
  });

  revalidatePath('/admin/orders');
}

export async function upsertOrderAdminAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const parsed = orderSchema.parse({
    customerName: asString(formData.get('customerName')),
    email: asString(formData.get('email')),
    shippingAddress: asString(formData.get('shippingAddress')),
    phone: asString(formData.get('phone')),
    chassisModelOrPartModel: asString(formData.get('chassisModelOrPartModel')),
    handedness: asString(formData.get('handedness')),
    finishColor: asString(formData.get('finishColor')),
    options: asString(formData.get('options')),
    specialInstructions: asString(formData.get('specialInstructions')),
    discipline: asString(formData.get('discipline')),
    caliber: asString(formData.get('caliber')),
    notes: asString(formData.get('notes'))
  });

  const data = {
    customerName: parsed.customerName,
    email: parsed.email,
    shippingAddress: parsed.shippingAddress,
    phone: parsed.phone,
    chassisModelOrPartModel: parsed.chassisModelOrPartModel || null,
    handedness: parsed.handedness || null,
    finishColor: parsed.finishColor || null,
    options: parsed.options || null,
    specialInstructions: parsed.specialInstructions || null,
    discipline: parsed.discipline || null,
    caliber: parsed.caliber || null,
    notes: parsed.notes || null,
    status: asString(formData.get('status')) || 'Pending'
  };

  if (id) {
    await prisma.order.update({ where: { id }, data });
  } else {
    await prisma.order.create({ data });
  }

  revalidatePath('/admin/orders');
}

export async function deleteOrderAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  if (!id) {
    return;
  }
  await prisma.order.delete({ where: { id } });
  revalidatePath('/admin/orders');
}

export async function upsertOrderAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  const parsed = orderSchema.safeParse({
    customerName: asString(formData.get('customerName')),
    email: asString(formData.get('email')),
    shippingAddress: asString(formData.get('shippingAddress')),
    phone: asString(formData.get('phone')),
    chassisModelOrPartModel: asString(formData.get('chassisModelOrPartModel')),
    handedness: asString(formData.get('handedness')),
    finishColor: asString(formData.get('finishColor')),
    options: asString(formData.get('options')),
    specialInstructions: asString(formData.get('specialInstructions')),
    discipline: asString(formData.get('discipline')),
    caliber: asString(formData.get('caliber')),
    notes: asString(formData.get('notes'))
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Invalid form submission.' };
  }

  const order = await prisma.order.create({
    data: {
      customerName: parsed.data.customerName,
      email: parsed.data.email,
      shippingAddress: parsed.data.shippingAddress,
      phone: parsed.data.phone,
      chassisModelOrPartModel: parsed.data.chassisModelOrPartModel || null,
      handedness: parsed.data.handedness || null,
      finishColor: parsed.data.finishColor || null,
      options: parsed.data.options || null,
      specialInstructions: parsed.data.specialInstructions || null,
      discipline: parsed.data.discipline || null,
      caliber: parsed.data.caliber || null,
      notes: parsed.data.notes || null,
      status: 'Pending'
    }
  });

  await sendOrderEmails(order);
  revalidatePath('/admin/orders');

  return {
    success: "Your order has been received. We'll be in touch within 24 hours."
  };
}

export async function upsertContentAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const entries = Array.from(formData.entries()).filter(([k]) => k !== '__action');
  for (const [key, value] of entries) {
    if (typeof value !== 'string') continue;
    await prisma.siteContent.upsert({
      where: { key },
      create: { key, value },
      update: { value }
    });
  }
  revalidatePath('/builds');
  revalidatePath('/contact');
  revalidatePath('/admin/content');
}

export async function updateSettingsAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const parsed = settingsSchema.parse({
    notificationEmail: asString(formData.get('notificationEmail'))
  });

  const existing = await prisma.settings.findFirst();

  if (existing) {
    await prisma.settings.update({
      where: { id: existing.id },
      data: {
        notificationEmail: parsed.notificationEmail
      }
    });
  } else {
    await prisma.settings.create({ data: { notificationEmail: parsed.notificationEmail } });
  }

  revalidatePath('/admin/settings');
}

export async function submitContactAction(formData: FormData): Promise<{ success?: string; error?: string }> {
  const name    = asString(formData.get('name'));
  const email   = asString(formData.get('email'));
  const phone   = asString(formData.get('phone'));
  const subject = asString(formData.get('subject'));
  const message = asString(formData.get('message'));

  if (!name || !email || !message) return { error: 'Name, email, and message are required.' };

  const { sendContactEmail } = await import('@/lib/email');
  await sendContactEmail({ name, email, phone, subject, message });
  return { success: "Message received. We'll be in touch within 24 hours." };
}

export async function upsertHeroAction(formData: FormData): Promise<void> {
  requireAdminSession();
  const id = asString(formData.get('id'));
  const backgroundImage = await resolveImageUrl(formData, 'backgroundImage');
  const parsed = heroSchema.parse({
    headline: asString(formData.get('headline')),
    subheadline: asString(formData.get('subheadline')),
    ctaButtonText: asString(formData.get('ctaButtonText')),
    ctaButtonUrl: asString(formData.get('ctaButtonUrl')),
    backgroundImage
  });

  const data = {
    headline: parsed.headline,
    subheadline: parsed.subheadline,
    ctaButtonText: parsed.ctaButtonText,
    ctaButtonUrl: parsed.ctaButtonUrl,
    backgroundImage: parsed.backgroundImage || null
  };

  if (id) {
    await prisma.hero.update({ where: { id }, data });
  } else {
    await prisma.hero.create({ data });
  }

  revalidatePath('/');
  revalidatePath('/admin/hero');
}
