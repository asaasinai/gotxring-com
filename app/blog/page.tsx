import Link from 'next/link';

import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const metadata = {
  title: 'Blog | GotXRing'
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } }
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <h1 className="text-4xl font-bold uppercase">Blog</h1>
      <p className="mt-3 max-w-3xl text-zinc-300">Technical insights, build science, and practical precision guidance.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {posts.map((post) => {
          const featuredImage = post.images[0];
          return (
            <article key={post.id} className="section-shell overflow-hidden rounded-lg">
              {featuredImage && (
                <Link href={`/blog/${post.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredImage.url}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                </Link>
              )}
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[#FF1A35]">{post.category}</p>
                <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">{formatDate(post.publishedAt ?? post.createdAt)}</p>
                {post.excerpt && <p className="mt-4 text-zinc-300">{post.excerpt}</p>}
                <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm underline underline-offset-4">
                  Read article
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
