import Link from 'next/link';

import { ChampionsClient } from '@/components/champions-client';
import { GalleryGrid } from '@/components/gallery-grid';
import { ProductCatalog } from '@/components/product-catalog';
import { YoutubeFeed } from '@/components/youtube-feed';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { getYoutubeVideos } from '@/lib/youtube';

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
  const [builds, champions, posts, press, hero, videos, gallery] = await Promise.all([
    prisma.build.findMany({ orderBy: [{ category: 'asc' }, { subcategory: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }], include: { images: { orderBy: { sortOrder: 'asc' } } } }),
    prisma.champion.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3, include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } } }),
    prisma.pressItem.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.hero.findFirst({ orderBy: { updatedAt: 'desc' } }),
    getYoutubeVideos(),
    prisma.galleryImage.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }], take: 8 }),
  ]);

  const heroContent = hero ?? defaultHero;
  const hasBgImage = !!heroContent.backgroundImage;

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden border-b border-zinc-800"
        style={hasBgImage ? {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.78)), url(${heroContent.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        {/* Atmospheric red glow (no-image state) */}
        {!hasBgImage && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-[#0d0d0d] to-[#111111]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_80%_20%,rgba(200,16,46,0.22),transparent)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </>
        )}
        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-28 md:py-36 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Competition Machine Inc</p>
          <h1 className="max-w-4xl text-4xl font-bold uppercase leading-tight md:text-6xl">{heroContent.headline}</h1>
          <p className="max-w-2xl text-zinc-300">{heroContent.subheadline}</p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary px-6 py-3 text-base" href={heroContent.ctaButtonUrl}>
              {heroContent.ctaButtonText}
            </Link>
            <Link className="btn-muted px-6 py-3 text-base" href="#systems">
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
        <ProductCatalog builds={builds} />
      </section>

      {/* ── Order CTA ── */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(200,16,46,0.13),transparent)]" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 md:px-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FF1A35]">Ready to Build</p>
          <h2 className="mt-2 text-3xl font-bold uppercase md:text-4xl">Configure Your Build</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-300">
            Tell us your mission profile and we will design a precision system around your performance goals.
          </p>
          <Link href="/order" className="btn-primary mt-6 inline-block px-8 py-3 text-base">
            Begin Order →
          </Link>
          <p className="mt-4 text-xs text-zinc-500">No payment required · Response within 24 hours</p>
        </div>
      </section>

      {/* ── YouTube Videos ── */}
      {videos.length > 0 && (
        <section className="border-y border-zinc-800 bg-[#0d0d0d]">
          <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#FF1A35]">From the Shop Floor</p>
                <h2 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em]">Build Process Videos</h2>
              </div>
              <a
                href="https://www.youtube.com/@garyeliseo1775"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5"
              >
                <svg className="h-4 w-4 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                View all on YouTube →
              </a>
            </div>
            <YoutubeFeed videos={videos} />
          </div>
        </section>
      )}

      {/* ── Champions Circle ── */}
      <section className="border-y border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Champions Circle</h2>
          <ChampionsClient champions={champions} />
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      {gallery.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#FF1A35]">From the Shop</p>
              <h2 className="mt-1 text-2xl font-bold uppercase tracking-[0.12em]">Gallery</h2>
            </div>
            <Link href="/gallery" className="text-sm text-zinc-400 hover:text-white transition">
              View all →
            </Link>
          </div>
          <GalleryGrid images={gallery} />
        </section>
      )}

      {/* ── Blog Preview ── */}
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">From the Blog</h2>
          <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition">
            Read all →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post) => {
            const featuredImage = post.images[0];
            return (
              <article key={post.id} className="section-shell overflow-hidden rounded-lg">
                {featuredImage && (
                  <Link href={`/blog/${post.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={featuredImage.url} alt={post.title} className="h-44 w-full object-cover" />
                  </Link>
                )}
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#FF1A35]">{post.category}</p>
                  <h3 className="mt-1 text-lg font-semibold">{post.title}</h3>
                  {post.excerpt && <p className="mt-2 text-sm text-zinc-300">{post.excerpt}</p>}
                  <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm text-white underline underline-offset-4">
                    Continue
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Press ── */}
      <section className="border-y border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Press</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {press.map((item) => (
              <article key={item.id} className="section-shell rounded-lg overflow-hidden flex flex-col">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.title} className="w-full h-44 object-cover" />
                )}
                <div className={`flex flex-1 ${!item.imageUrl ? 'border-l-4 border-[#FF1A35]' : 'border-t border-zinc-800'}`}>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">{item.publication}</p>
                    <h3 className="mt-2 text-base font-semibold text-zinc-200 leading-snug">{item.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500">{formatDate(item.publishedAt)}</p>
                    <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-[#FF1A35] hover:text-red-400 underline underline-offset-4 transition">
                      Read source ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Follow ── */}
      <section className="border-t border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Follow the Build</h2>
            <p className="max-w-lg text-zinc-400 text-sm">
              Latest builds, competition results, and behind-the-scenes content from the shop.
            </p>
            <a
              href="https://www.facebook.com/profile.php?id=100057410442994"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-muted mt-2 inline-flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Follow on Facebook
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
