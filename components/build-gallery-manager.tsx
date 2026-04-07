'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { addBuildImageAction, deleteBuildImageAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';

type GalleryImage = { id: string; url: string; sortOrder: number };

export function BuildGalleryManager({ buildId, images }: { buildId: string; images: GalleryImage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editorKey, setEditorKey] = useState(0);

  function handleAdd(formData: FormData) {
    const url = formData.get('imageUrl');
    if (!url || typeof url !== 'string' || !url.startsWith('http')) return;
    startTransition(async () => {
      await addBuildImageAction(formData);
      setEditorKey((k) => k + 1);
      router.refresh();
    });
  }

  function handleDelete(imageId: string) {
    const fd = new FormData();
    fd.append('id', imageId);
    startTransition(async () => {
      await deleteBuildImageAction(fd);
      router.refresh();
    });
  }

  return (
    <div className="mt-2 grid gap-3 rounded-lg border border-zinc-800 p-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Gallery Images</span>
        <span className={`text-xs ${images.length >= 25 ? 'text-[#C8102E]' : 'text-zinc-500'}`}>{images.length} / 25</span>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <div key={img.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-16 w-20 rounded border border-zinc-700 object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                disabled={isPending}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-900 text-[10px] text-white opacity-0 transition hover:bg-red-700 group-hover:opacity-100 disabled:cursor-wait"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p className="text-xs text-zinc-600">No gallery images yet. Add images below.</p>
      )}

      {images.length < 25 && (
        <details className="rounded border border-zinc-800 bg-black/20">
          <summary className="cursor-pointer px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-400 hover:text-white">
            + Add Image
          </summary>
          <div className="p-3">
            <form action={handleAdd}>
              <input type="hidden" name="buildId" value={buildId} />
              <ImageEditor key={editorKey} urlInputName="imageUrl" label="Gallery Image" />
              <button type="submit" disabled={isPending} className="btn-primary mt-3 text-sm">
                {isPending ? 'Saving…' : 'Add to Gallery'}
              </button>
            </form>
          </div>
        </details>
      )}
    </div>
  );
}
