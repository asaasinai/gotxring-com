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
    orderBy: { publishedAt: 'desc' }
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <h1 className="text-4xl font-bold uppercase">Blog</h1>
      <p className="mt-3 max-w-3xl text-zinc-300">Technical insights, build science, and practical precision guidance.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="section-shell rounded-lg p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#C8102E]">{post.category}</p>
            <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{formatDate(post.publishedAt ?? post.createdAt)}</p>
            <p className="mt-4 text-zinc-300">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-block text-sm underline underline-offset-4">
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
