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
  const [savedMsg, setSavedMsg] = useState('');

  // Called automatically when ImageEditor finishes uploading to Blob
  function handleUpload(url: string) {
    const fd = new FormData();
    fd.append('buildId', buildId);
    fd.append('imageUrl', url);
    startTransition(async () => {
      await addBuildImageAction(fd);
      setEditorKey((k) => k + 1); // reset editor for next image
      setSavedMsg('✓ Image saved to gallery');
      setTimeout(() => setSavedMsg(''), 3000);
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Gallery Images</span>
        <span className={`text-xs font-mono ${images.length >= 25 ? 'text-[#C8102E]' : 'text-zinc-500'}`}>
          {images.length} / 25
        </span>
        {savedMsg && (
          <span className="ml-auto rounded bg-green-900/50 px-2 py-0.5 text-xs text-green-300">{savedMsg}</span>
        )}
        {isPending && (
          <span className="ml-auto text-xs text-zinc-500">Saving…</span>
        )}
      </div>

      {/* Thumbnail grid */}
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <div key={img.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`Gallery image ${i + 1}`} className="h-16 w-20 rounded border border-zinc-700 object-cover" />
              <span className="absolute bottom-0 left-0 rounded-bl rounded-tr bg-black/60 px-1 text-[9px] text-zinc-400">{i + 1}</span>
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
      ) : (
        <p className="text-xs text-zinc-600">No gallery images yet. Upload one below.</p>
      )}

      {/* Add image section */}
      {images.length < 25 && (
        <details className="rounded border border-zinc-800 bg-black/20" open={images.length === 0}>
          <summary className="cursor-pointer px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-400 hover:text-white">
            + Upload Image
          </summary>
          <div className="p-3">
            <p className="mb-3 text-xs text-zinc-500">
              Select an image, crop/rotate if needed, then click <strong className="text-zinc-300">Apply &amp; Upload</strong> — it saves automatically.
            </p>
            <ImageEditor
              key={editorKey}
              urlInputName="_gallery_unused"
              label="Gallery Image"
              onUpload={handleUpload}
            />
          </div>
        </details>
      )}
    </div>
  );
}
