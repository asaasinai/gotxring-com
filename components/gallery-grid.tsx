'use client';

import { useEffect, useState } from 'react';

type GalleryItem = { id: string; url: string; caption: string };

export function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
      if (e.key === 'ArrowRight') {
        const idx = images.findIndex((i) => i.id === active.id);
        if (idx < images.length - 1) setActive(images[idx + 1]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = images.findIndex((i) => i.id === active.id);
        if (idx > 0) setActive(images[idx - 1]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, images]);

  if (!images.length) return (
    <p className="text-zinc-500 text-sm">No gallery images yet.</p>
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(img)}
            className="group relative overflow-hidden rounded-lg bg-zinc-900 focus:outline-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption || 'Gallery image'}
              className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-90"
              loading="lazy"
            />
            {img.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-2 pt-4 opacity-0 transition group-hover:opacity-100">
                <p className="text-xs text-white">{img.caption}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative max-h-[92vh] max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={active.caption || 'Gallery image'}
              className="mx-auto max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {active.caption && (
              <p className="mt-3 text-center text-sm text-zinc-300">{active.caption}</p>
            )}

            {/* Prev / Next */}
            {images.findIndex((i) => i.id === active.id) > 0 && (
              <button
                type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-black/80 text-white hover:border-zinc-400 transition"
                onClick={(e) => { e.stopPropagation(); const idx = images.findIndex(i => i.id === active.id); setActive(images[idx - 1]); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            )}
            {images.findIndex((i) => i.id === active.id) < images.length - 1 && (
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-black/80 text-white hover:border-zinc-400 transition"
                onClick={(e) => { e.stopPropagation(); const idx = images.findIndex(i => i.id === active.id); setActive(images[idx + 1]); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}

            {/* Close */}
            <button
              type="button"
              className="absolute -top-10 right-0 text-zinc-400 hover:text-white text-sm transition"
              onClick={() => setActive(null)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
