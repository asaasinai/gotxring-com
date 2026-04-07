import Link from 'next/link';
import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
      <p className="text-xs uppercase tracking-[0.16em] text-[#C8102E]">{post.category}</p>
      <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-400">By {post.author} · {formatDate(post.publishedAt ?? post.createdAt)}</p>
      <div className="section-shell mt-8 rounded-xl p-6 md:p-8">
        <p className="whitespace-pre-wrap leading-8 text-zinc-200">{post.content}</p>
      </div>
      <Link href="/blog" className="mt-6 inline-block text-sm underline underline-offset-4">
        Back to blog
      </Link>
    </article>
  );
}
