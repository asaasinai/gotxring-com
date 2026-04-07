import Link from 'next/link';

import { ChampionsClient } from '@/components/champions-client';
import { ProductCatalog } from '@/components/product-catalog';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const defaultHero = {
  headline: 'Engineered for the Win.',
  subheadline:
    'Custom precision rifle systems built for decisive performance across F-Class, PRS, tactical, and long-range hunting disciplines.',
  ctaButtonText: 'Configure Your Build',
  ctaButtonUrl: '/order',
  backgroundImage: ''
};

export default async function HomePage() {
  const [builds, champions, posts, press, hero] = await Promise.all([
    prisma.build.findMany({ orderBy: [{ category: 'asc' }, { subcategory: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }], include: { images: { orderBy: { sortOrder: 'asc' } } } }),
    prisma.champion.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.pressItem.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.hero.findFirst({ orderBy: { updatedAt: 'desc' } })
  ]);

  const heroContent = hero ?? defaultHero;

  // Group builds into category → subcategory hierarchy
  const categoryMap = new Map<string, Map<string, typeof builds>>();
  for (const build of builds) {
    const cat = build.category || 'Other';
    const sub = build.subcategory || '';
    if (!categoryMap.has(cat)) categoryMap.set(cat, new Map());
    const subMap = categoryMap.get(cat)!;
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub)!.push(build);
  }

  const grouped = Array.from(categoryMap.entries()).map(([category, subMap]) => ({
    category,
    subcategories: Array.from(subMap.entries()).map(([name, items]) => ({ name, builds: items }))
  }));

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="border-b border-zinc-800 bg-gradient-to-br from-black to-[#111111]"
        style={{
          backgroundImage: heroContent.backgroundImage
            ? `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.78)), url(${heroContent.backgroundImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-24 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Competition Machine Inc</p>
          <h1 className="max-w-4xl text-4xl font-bold uppercase leading-tight md:text-6xl">{heroContent.headline}</h1>
          <p className="max-w-2xl text-zinc-200">{heroContent.subheadline}</p>
          <div className="flex gap-3">
            <Link className="btn-primary" href={heroContent.ctaButtonUrl}>
              {heroContent.ctaButtonText}
            </Link>
            <Link className="btn-muted" href="#systems">
              Explore Systems
            </Link>
          </div>
        </div>
      </section>

      {/* ── Product Catalog ── */}
      <section id="systems" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">What We Build</p>
            <h2 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em]">Our Systems</h2>
          </div>
        </div>
        <ProductCatalog grouped={grouped} />
      </section>

      {/* ── Champions Circle ── */}
      <section className="border-y border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Champions Circle</h2>
          <ChampionsClient champions={champions} />
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Blog Preview</h2>
          <Link href="/blog" className="text-sm text-zinc-300 hover:text-white">
            Read all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="section-shell rounded-lg p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#C8102E]">{post.category}</p>
              <h3 className="mt-1 text-lg font-semibold">{post.title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-white underline underline-offset-4">
                Continue
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Press ── */}
      <section className="border-y border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Press</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {press.map((item) => (
              <article key={item.id} className="section-shell rounded-lg p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">{item.publication}</p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-zinc-300">{formatDate(item.publishedAt)}</p>
                <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-white underline underline-offset-4">
                  Read source
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Order CTA ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        <div className="section-shell rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold uppercase">Configure Your Build</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
            Tell us your mission profile and we will design a precision system around your performance goals.
          </p>
          <Link href="/order" className="btn-primary mt-6 inline-block">
            Begin Order
          </Link>
        </div>
      </section>

      {/* ── Facebook Feed ── */}
      <section className="border-t border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
          <h2 className="mb-8 text-2xl font-bold uppercase tracking-[0.12em]">Latest from Facebook</h2>
          <div className="flex justify-center">
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100057410442994&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
              width="500"
              height="600"
              style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
