'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type GalleryItem = { id: string; url: string; caption: string };

function askLink(img: GalleryItem) {
  const params = new URLSearchParams({ imageUrl: img.url });
  if (img.caption) params.set('caption', img.caption);
  return `/contact?${params.toString()}`;
}

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
          <div key={img.id} className="group relative overflow-hidden rounded-lg bg-zinc-900">
            <button
              type="button"
              onClick={() => setActive(img)}
              className="block w-full focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption || 'Gallery image'}
                className="w-full aspect-square object-cover transition duration-300 group-hover:scale-105 group-hover:opacity-80"
                loading="lazy"
              />
            </button>
            {/* Hover overlay — caption + ask button */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-2 pb-2 pt-6 opacity-0 transition group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
              {img.caption && (
                <p className="mb-1.5 text-xs text-white">{img.caption}</p>
              )}
              <Link
                href={askLink(img)}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 rounded bg-[#FF1A35] px-2 py-1 text-[11px] font-semibold text-white hover:bg-red-500 transition"
              >
                Ask about this system →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setActive(null)}
        >
          {/* Close */}
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border-2 border-white/40 text-white hover:bg-white/25 hover:border-white transition"
            onClick={() => setActive(null)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-8 w-8">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div className="relative flex w-full max-w-5xl items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* Prev */}
            {images.findIndex((i) => i.id === active.id) > 0 && (
              <button
                type="button"
                aria-label="Previous"
                className="absolute left-0 -translate-x-16 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border-2 border-white/40 text-white hover:bg-white/25 hover:border-white transition"
                onClick={(e) => { e.stopPropagation(); const idx = images.findIndex(i => i.id === active.id); setActive(images[idx - 1]); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-7 w-7"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            )}

            <div className="max-h-[85vh] w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.url}
                alt={active.caption || 'Gallery image'}
                className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
              />
              <div className="mt-4 flex flex-col items-center gap-3">
                {active.caption && (
                  <p className="text-center text-base text-zinc-200">{active.caption}</p>
                )}
                <Link
                  href={askLink(active)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#FF1A35] px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition"
                  onClick={() => setActive(null)}
                >
                  Ask about this system →
                </Link>
              </div>
            </div>

            {/* Next */}
            {images.findIndex((i) => i.id === active.id) < images.length - 1 && (
              <button
                type="button"
                aria-label="Next"
                className="absolute right-0 translate-x-16 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border-2 border-white/40 text-white hover:bg-white/25 hover:border-white transition"
                onClick={(e) => { e.stopPropagation(); const idx = images.findIndex(i => i.id === active.id); setActive(images[idx + 1]); }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-7 w-7"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
