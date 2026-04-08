'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { upsertBlogPostAction, addBlogPostImageAction, deleteBlogPostImageAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';

type BlogPostImage = { id: string; url: string; sortOrder: number };

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
  images: BlogPostImage[];
};

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function BlogImageGallery({ postId, images }: { postId: string; images: BlogPostImage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editorKey, setEditorKey] = useState(0);
  const [savedMsg, setSavedMsg] = useState('');

  function handleUpload(url: string) {
    const fd = new FormData();
    fd.append('postId', postId);
    fd.append('imageUrl', url);
    startTransition(async () => {
      await addBlogPostImageAction(fd);
      setEditorKey((k) => k + 1);
      setSavedMsg('✓ Image saved');
      setTimeout(() => setSavedMsg(''), 3000);
      router.refresh();
    });
  }

  function handleDelete(imageId: string) {
    if (!confirm('Remove this image?')) return;
    const fd = new FormData();
    fd.append('id', imageId);
    startTransition(async () => {
      await deleteBlogPostImageAction(fd);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-3 rounded-lg border border-zinc-800 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Post Images</span>
        <span className="text-[10px] text-zinc-500">First = featured · rest appear after content</span>
        {savedMsg && <span className="ml-auto rounded bg-green-900/50 px-2 py-0.5 text-xs text-green-300">{savedMsg}</span>}
        {isPending && <span className="ml-auto text-xs text-zinc-500">Saving…</span>}
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={img.id} className="flex flex-col items-center gap-1">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={`Image ${i + 1}`} className="h-16 w-20 rounded border border-zinc-700 object-cover" />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 rounded-bl rounded-tr bg-[#FF1A35]/80 px-1 text-[9px] text-white">Featured</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                disabled={isPending}
                className="text-[11px] text-red-500 hover:text-red-300 disabled:cursor-wait"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <details className="rounded border border-zinc-800 bg-black/20" open={images.length === 0}>
        <summary className="cursor-pointer px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-400 hover:text-white">
          + Upload Image
        </summary>
        <div className="p-3">
          <ImageEditor
            key={editorKey}
            urlInputName="_blog_img_unused"
            label="Blog Image"
            onUpload={handleUpload}
          />
        </div>
      </details>
    </div>
  );
}

export function BlogPostFormClient({ post }: { post?: BlogPost }) {
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(!!post?.slug);
  const [imageUploading, setImageUploading] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugEdited) setSlug(toSlug(e.target.value));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value);
    setSlugEdited(true);
  }

  function handleSlugBlur() {
    setSlug((s) => toSlug(s));
  }

  return (
    <div className="grid gap-4">
      <form action={upsertBlogPostAction} className="grid gap-3">
        <input type="hidden" name="id" defaultValue={post?.id} />
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="label">Title</label>
            <input className="input" name="title" required defaultValue={post?.title} onChange={handleTitleChange} />
          </div>
          <div>
            <label className="label">
              Slug <span className="font-normal normal-case text-[10px] text-zinc-500">(auto-generated from title)</span>
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
          <label className="label">
            Excerpt <span className="font-normal normal-case text-[10px] text-zinc-500">(optional — shown in listings)</span>
          </label>
          <textarea className="input min-h-16" name="excerpt" defaultValue={post?.excerpt} />
        </div>
        <div>
          <label className="label">
            Content <span className="font-normal normal-case text-[10px] text-zinc-500">(supports plain text)</span>
          </label>
          <textarea className="input min-h-40" name="content" required defaultValue={post?.content} />
        </div>
        {!post && (
          <ImageEditor
            urlInputName="imageUrl"
            label="Featured Image (optional)"
            onUploadingChange={setImageUploading}
          />
        )}
        <div>
          <label className="label">
            Source URL <span className="font-normal normal-case text-[10px] text-zinc-500">(optional)</span>
          </label>
          <input className="input" name="sourceUrl" defaultValue={post?.sourceUrl ?? ''} />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="published" defaultChecked={post?.published} />
          Published <span className="text-xs text-zinc-500">(visible on site)</span>
        </label>
        <button className="btn-primary w-fit" disabled={imageUploading}>
          {imageUploading ? 'Uploading image…' : post ? 'Save Changes' : 'Create Post'}
        </button>
      </form>

      {post && (
        <BlogImageGallery postId={post.id} images={post.images ?? []} />
      )}
    </div>
  );
}
