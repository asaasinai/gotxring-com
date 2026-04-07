import { BlogPost } from '@prisma/client';

import { deleteBlogPostAction, upsertBlogPostAction } from '@/lib/actions';
import { DeleteButton } from '@/components/delete-button';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function BlogPostForm({ post }: { post?: BlogPost }) {
  return (
    <form action={upsertBlogPostAction} className="grid gap-3">
      <input type="hidden" name="id" defaultValue={post?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Title</label>
          <input className="input" name="title" required defaultValue={post?.title} />
        </div>
        <div>
          <label className="label">Slug <span className="font-normal normal-case text-[10px] text-zinc-500">(URL path, e.g. my-article-title)</span></label>
          <input className="input" name="slug" required defaultValue={post?.slug} placeholder="my-article-title" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <input className="input" name="category" required defaultValue={post?.category} placeholder="e.g. Education, Maintenance" />
        </div>
        <div>
          <label className="label">Author</label>
          <input className="input" name="author" required defaultValue={post?.author} />
        </div>
      </div>
      <div>
        <label className="label">Excerpt <span className="font-normal normal-case text-[10px] text-zinc-500">(short summary shown in listings)</span></label>
        <textarea className="input min-h-16" name="excerpt" required defaultValue={post?.excerpt} />
      </div>
      <div>
        <label className="label">Content <span className="font-normal normal-case text-[10px] text-zinc-500">(supports plain text)</span></label>
        <textarea className="input min-h-40" name="content" required defaultValue={post?.content} />
      </div>
      <ImageEditor urlInputName="imageUrl" currentUrl={post?.imageUrl} label="Post Image" />
      <div>
        <label className="label">Source URL <span className="font-normal normal-case text-[10px] text-zinc-500">(optional — original article link)</span></label>
        <input className="input" name="sourceUrl" defaultValue={post?.sourceUrl ?? ''} />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="published" defaultChecked={post?.published} />
        Published <span className="text-xs text-zinc-500">(visible on site)</span>
      </label>
      <button className="btn-primary w-fit">{post ? 'Save Changes' : 'Create Post'}</button>
    </form>
  );
}

export default async function AdminBlogPostsPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Blog Posts</h1>

      {/* Add New */}
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900/20 p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">＋ Write New Post</p>
        <BlogPostForm />
      </div>

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
                <span className="text-xs text-zinc-500 shrink-0">Click to edit ▾</span>
              </summary>
              <div className="border-t border-zinc-800 p-4 grid gap-4">
                <BlogPostForm post={post} />
                <DeleteButton action={deleteBlogPostAction} id={post.id} label={`"${post.title}"`} />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
