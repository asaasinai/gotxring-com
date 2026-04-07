'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type BuildImage = { id: string; url: string; sortOrder: number };

type Build = {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  caliber: string;
  chassisType: string;
  discipline: string;
  imageUrl: string | null;
  specifications: Record<string, string> | unknown;
  featured: boolean;
  images: BuildImage[];
};

type GroupedBuilds = {
  category: string;
  subcategories: {
    name: string;
    builds: Build[];
  }[];
}[];

function specEntries(specs: unknown): [string, string][] {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return [];
  return Object.entries(specs as Record<string, unknown>)
    .filter(([, v]) => v !== null && v !== undefined && v !== '')
    .map(([k, v]) => [k, String(v)]);
}

function getImages(build: Build): string[] {
  const gallery = (build.images ?? []).map((i) => i.url);
  if (gallery.length > 0) return gallery;
  return build.imageUrl ? [build.imageUrl] : [];
}

// ─── Image Carousel ──────────────────────────────────────────────────────────

function ImageCarousel({ images, className }: { images: string[]; className?: string }) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  if (!images.length) {
    return <div className={`bg-zinc-900 ${className ?? ''}`} />;
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* Main image */}
      <div
        className="h-full w-full"
        style={{
          backgroundImage: `url(${images[idx]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Navigation — only when multiple images */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 active:scale-95"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 active:scale-95"
            aria-label="Next image"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.slice(0, 10).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/40'}`}
                aria-label={`Image ${i + 1}`}
              />
            ))}
            {images.length > 10 && (
              <span className="text-[10px] text-white/60">{idx + 1}/{images.length}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Thumbnail Strip ──────────────────────────────────────────────────────────

function ThumbnailStrip({ images, activeIdx, onSelect }: { images: string[]; activeIdx: number; onSelect: (i: number) => void }) {
  if (images.length <= 1) return null;
  return (
    <div className="flex gap-1.5 overflow-x-auto bg-zinc-950 p-2 scrollbar-none">
      {images.map((url, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={`shrink-0 overflow-hidden rounded border-2 transition ${i === activeIdx ? 'border-[#C8102E]' : 'border-transparent opacity-60 hover:opacity-100'}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-12 w-16 object-cover" />
        </button>
      ))}
    </div>
  );
}

// ─── Build Modal ──────────────────────────────────────────────────────────────

function BuildModal({ build, onClose }: { build: Build; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  const images = getImages(build);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && images.length > 1) setImgIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight' && images.length > 1) setImgIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', fn);
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose, images.length]);

  const prev = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setImgIdx((i) => (i + 1) % images.length);

  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/85 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="section-shell flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-2xl sm:max-h-[92vh] sm:max-w-5xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center py-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-zinc-700" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:flex-row">
          {/* ── Image Panel ── */}
          <div className="flex shrink-0 flex-col lg:w-[58%]">
            {/* Main image */}
            <div
              className="relative min-h-56 flex-1 bg-zinc-900 sm:min-h-72 lg:min-h-[380px]"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={images[imgIdx] ? {
                backgroundImage: `url(${images[imgIdx]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : undefined}
            >
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white hover:bg-black/80"
                    aria-label="Previous"
                  >‹</button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white hover:bg-black/80"
                    aria-label="Next"
                  >›</button>
                  <div className="absolute bottom-2 right-3 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
                    {imgIdx + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            <ThumbnailStrip images={images} activeIdx={imgIdx} onSelect={setImgIdx} />
          </div>

          {/* ── Details Panel ── */}
          <div className="flex flex-col gap-4 overflow-auto p-5 lg:flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C8102E]">
                  {build.category}{build.subcategory ? ` · ${build.subcategory}` : ''}
                </p>
                <h2 className="mt-2 text-xl font-bold leading-tight sm:text-2xl">{build.name}</h2>
                <p className="mt-1 text-sm text-zinc-400">{build.caliber}</p>
              </div>
              <button type="button" onClick={onClose} className="btn-muted shrink-0 text-xs">✕ Close</button>
            </div>

            <p className="text-sm leading-relaxed text-zinc-300">{build.description}</p>

            {specEntries(build.specifications).length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-black/50 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Specifications</p>
                <div className="grid gap-2 text-xs">
                  {specEntries(build.specifications).map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4 border-b border-zinc-800/60 pb-2 last:border-0 last:pb-0">
                      <span className="shrink-0 uppercase tracking-[0.12em] text-zinc-500">{k.replace(/_/g, ' ')}</span>
                      <span className="text-right text-zinc-100">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/order?system=${encodeURIComponent(build.name)}&category=${encodeURIComponent(build.category)}`}
              className="btn-primary mt-auto text-center text-sm"
              onClick={onClose}
            >
              Configure This System
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Build Card ───────────────────────────────────────────────────────────────

function BuildCard({ build, onClick }: { build: Build; onClick: () => void }) {
  const images = getImages(build);
  const specs = specEntries(build.specifications).slice(0, 3);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group section-shell overflow-hidden rounded-xl text-left transition hover:border-zinc-500 hover:shadow-lg hover:shadow-black/40 active:scale-[0.99]"
    >
      {/* Image / carousel */}
      <div className="relative aspect-[4/3] bg-zinc-900">
        {images.length > 0 ? (
          <>
            <ImageCarousel
              images={images}
              className="absolute inset-0"
            />
            {/* gradient overlay for text */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75))' }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-zinc-700">No image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-[#C8102E]/0 transition group-hover:bg-[#C8102E]/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
          <h3 className="text-sm font-bold leading-tight text-white drop-shadow-sm">{build.name}</h3>
          <p className="mt-0.5 text-xs text-zinc-300">{build.caliber}</p>
        </div>
      </div>
      {/* Specs preview */}
      {specs.length > 0 && (
        <div className="grid gap-1.5 p-3 text-xs">
          {specs.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-2">
              <span className="uppercase tracking-[0.1em] text-zinc-500">{k.replace(/_/g, ' ')}</span>
              <span className="text-right text-zinc-300">{v}</span>
            </div>
          ))}
          <p className="mt-1 text-[10px] uppercase tracking-widest text-[#C8102E]">View Details →</p>
        </div>
      )}
    </button>
  );
}

// ─── Product Catalog ──────────────────────────────────────────────────────────

export function ProductCatalog({ grouped }: { grouped: GroupedBuilds }) {
  const [active, setActive] = useState<Build | null>(null);

  if (!grouped.length) return null;

  return (
    <div className="grid gap-14">
      {grouped.map(({ category, subcategories }) => (
        <div key={category}>
          {/* Category header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-8 w-1 shrink-0 rounded-full bg-[#C8102E]" />
            <h2 className="text-xl font-bold uppercase tracking-[0.1em] sm:text-2xl">{category}</h2>
          </div>

          <div className="grid gap-10">
            {subcategories.map(({ name: sub, builds }) => (
              <div key={sub}>
                {sub && (
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{sub}</span>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {builds.map((build) => (
                    <BuildCard key={build.id} build={build} onClick={() => setActive(build)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {active && <BuildModal build={active} onClose={() => setActive(null)} />}
    </div>
  );
}
