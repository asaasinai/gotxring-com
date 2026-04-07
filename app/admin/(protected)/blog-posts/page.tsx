import { BlogPost } from '@prisma/client';

import { deleteBlogPostAction, upsertBlogPostAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function BlogPostForm({ post }: { post?: BlogPost }) {
  return (
    <form action={upsertBlogPostAction} className="section-shell grid gap-3 rounded-lg p-4">
      <input type="hidden" name="id" defaultValue={post?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Title</label>
          <input className="input" name="title" required defaultValue={post?.title} />
        </div>
        <div>
          <label className="label">Slug</label>
          <input className="input" name="slug" required defaultValue={post?.slug} />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <input className="input" name="category" required defaultValue={post?.category} />
        </div>
        <div>
          <label className="label">Author</label>
          <input className="input" name="author" required defaultValue={post?.author} />
        </div>
      </div>
      <div>
        <label className="label">Excerpt</label>
        <textarea className="input min-h-20" name="excerpt" required defaultValue={post?.excerpt} />
      </div>
      <div>
        <label className="label">Content</label>
        <textarea className="input min-h-28" name="content" required defaultValue={post?.content} />
      </div>
      <ImageEditor urlInputName="imageUrl" currentUrl={post?.imageUrl} label="Post Image" />
      <div>
        <label className="label">Source URL</label>
        <input className="input" name="sourceUrl" defaultValue={post?.sourceUrl ?? ''} />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="published" defaultChecked={post?.published} /> Published
      </label>
      <button className="btn-primary w-fit">{post ? 'Update Blog Post' : 'Create Blog Post'}</button>
    </form>
  );
}

export default async function AdminBlogPostsPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Blog Posts</h1>
      <BlogPostForm />
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="grid gap-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
            <BlogPostForm post={post} />
            <form action={deleteBlogPostAction}>
              <input type="hidden" name="id" value={post.id} />
              <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
