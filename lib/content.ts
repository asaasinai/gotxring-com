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
  lead_time: '8–10 weeks',
  order_phone: '928-649-0742',
  about_featured_image: '',
  about_body: `I started Competition Machine Inc out of a simple belief: every shooter deserves a rifle built to the same standard as the ones winning national titles.

For over two decades, I've worked alongside competitive shooters at every level—from grassroots benchrest clubs to the national PRS circuit. That experience shaped how we build: no shortcuts, no compromises, and every component selected for a reason.

Whether you're a first-time custom buyer or a seasoned competitor, we take the time to understand your discipline, your style, and your goals. Then we build accordingly.

If you're ready to shoot at the top of your class, I'd like to build the rifle that gets you there.`,
  about_signature_image: '',
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
