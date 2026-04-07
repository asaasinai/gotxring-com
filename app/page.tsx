import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [builds, champions, posts, press] = await Promise.all([
    prisma.build.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.champion.findMany({ where: { featured: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.pressItem.findMany({ orderBy: { publishedAt: 'desc' }, take: 3 })
  ]);

  return (
    <div>
      <section className="border-b border-zinc-800 bg-gradient-to-br from-black to-[#111111]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-20 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Competition Machine Inc</p>
          <h1 className="max-w-4xl text-4xl font-bold uppercase leading-tight md:text-6xl">
            Precision rifle systems built for <span className="text-[#C8102E]">decisive performance</span>
          </h1>
          <p className="max-w-2xl text-zinc-300">
            GotXRing delivers elite custom rifles engineered for F-Class, PRS, tactical, and long-range hunting disciplines.
          </p>
          <div className="flex gap-3">
            <Link className="btn-primary" href="/builds">
              Explore Builds
            </Link>
            <Link className="btn-muted" href="/order">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Builds Gallery</h2>
          <Link href="/builds" className="text-sm text-zinc-300 hover:text-white">
            View all builds
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {builds.map((build) => (
            <article key={build.id} className="section-shell rounded-lg p-4">
              <div className="mb-3 h-40 rounded bg-zinc-900" style={{ backgroundImage: `url(${build.imageUrl ?? ''})`, backgroundSize: 'cover' }} />
              <p className="text-xs uppercase tracking-[0.16em] text-[#C8102E]">{build.discipline}</p>
              <h3 className="mt-1 text-lg font-semibold">{build.name}</h3>
              <p className="text-sm text-zinc-300">{build.caliber}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-14 md:px-8">
          <h2 className="text-2xl font-bold uppercase tracking-[0.12em]">Champions Circle</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {champions.map((champion) => (
              <article key={champion.id} className="section-shell rounded-lg p-5">
                <p className="text-sm text-zinc-300">{champion.title}</p>
                <h3 className="mt-1 text-xl font-semibold">{champion.name}</h3>
                <p className="mt-3 text-zinc-200">“{champion.quote}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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

      <section className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        <div className="section-shell rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold uppercase">Order Your Build</h2>
          <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
            Tell us your mission profile and we will design a precision system around your performance goals.
          </p>
          <Link href="/order" className="btn-primary mt-6 inline-block">
            Begin Order
          </Link>
        </div>
      </section>
    </div>
  );
}
