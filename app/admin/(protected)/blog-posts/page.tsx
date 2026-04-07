import { deleteBlogPostAction } from '@/lib/actions';
import { BlogPostFormClient } from '@/components/blog-post-form-client';
import { DeleteButton } from '@/components/delete-button';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPostsPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Blog Posts</h1>

      {/* Add New */}
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900/20 p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">＋ Write New Post</p>
        <BlogPostFormClient />
      </div>

      {posts.length === 0 && (
        <p className="text-sm text-zinc-500">No posts yet. Write your first one above.</p>
      )}

      {/* Existing posts */}
      {posts.length > 0 && (
        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-wider text-zinc-500">{posts.length} existing post{posts.length !== 1 ? 's' : ''}</p>
          {posts.map((post) => (
            <details key={post.id} className="rounded-lg border border-zinc-800 bg-black/30">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 select-none">
                <div>
                  <span className="font-semibold text-zinc-200">{post.title}</span>
                  {!post.published && <span className="ml-2 rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400">Draft</span>}
                </div>
                <span className="shrink-0 text-zinc-500 inline-block transition-transform [[open]_&]:rotate-180">▾</span>
              </summary>
              <div className="border-t border-zinc-800 p-4 grid gap-4">
                <BlogPostFormClient post={post} />
                <DeleteButton action={deleteBlogPostAction} id={post.id} label={`"${post.title}"`} />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
