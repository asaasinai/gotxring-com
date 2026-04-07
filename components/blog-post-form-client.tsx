'use client';

import { useState, useRef } from 'react';

import { upsertBlogPostAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  sourceUrl: string | null;
  published: boolean;
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function BlogPostFormClient({ post }: { post?: BlogPost }) {
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(!!post?.slug);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugEdited) {
      setSlug(toSlug(e.target.value));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    setSlugEdited(true);
  }

  function handleSlugBlur() {
    setSlug((s) => toSlug(s));
  }

  return (
    <form action={upsertBlogPostAction} className="grid gap-3">
      <input type="hidden" name="id" defaultValue={post?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            name="title"
            required
            defaultValue={post?.title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label className="label">
            Slug <span className="font-normal normal-case text-[10px] text-zinc-500">(URL path — auto-generated from title)</span>
          </label>
          <input
            className="input font-mono text-sm"
            name="slug"
            required
            value={slug}
            onChange={handleSlugChange}
            onBlur={handleSlugBlur}
            placeholder="my-article-title"
          />
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
      <ImageEditor urlInputName="imageUrl" currentUrl={post?.imageUrl ?? ''} label="Post Image" />
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
