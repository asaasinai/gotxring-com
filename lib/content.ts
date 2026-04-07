import { prisma } from '@/lib/prisma';

// Keys and their defaults
export const CONTENT_KEYS = {
  builds_title: 'Our Systems',
  builds_subtext: 'Explore mission-specific rifle systems from competition-ready F-Class platforms to precision rimfire and chassis solutions.',
  contact_title: 'Contact Us',
  contact_subtext: 'Questions about a build, lead times, or custom options? Reach out and we\'ll get back to you within 24 hours.',
  contact_address: '',
  contact_phone: '',
  contact_email: '',
} as const;

export type ContentKey = keyof typeof CONTENT_KEYS;

export async function getContent(key: ContentKey): Promise<string> {
  const row = await prisma.siteContent.findUnique({ where: { key } });
  return row?.value ?? CONTENT_KEYS[key];
}

export async function getManyContent(keys: ContentKey[]): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany({ where: { key: { in: keys } } });
  const map: Record<string, string> = {};
  for (const key of keys) {
    const row = rows.find(r => r.key === key);
    map[key] = row?.value ?? CONTENT_KEYS[key];
  }
  return map;
}
