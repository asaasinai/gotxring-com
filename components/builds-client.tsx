'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const filters = ['All', 'F-Class', 'PRS', 'Benchrest', 'Tactical', 'Hunting', 'Sporting'];

type BuildImage = { id: string; url: string; sortOrder: number };

type BuildCard = {
  id: string;
  name: string;
  description: string;
  discipline: string;
  caliber: string;
  chassisType: string;
  imageUrl: string | null;
  specifications: Record<string, unknown> | unknown;
  images: BuildImage[];
};

function normalizeDiscipline(discipline: string): string {
  if (discipline === 'Long Range Hunter') return 'Hunting';
  return discipline;
}

function specEntries(specifications: BuildCard['specifications']) {
  if (!specifications || typeof specifications !== 'object' || Array.isArray(specifications)) {
    return [['Specs', JSON.stringify(specifications ?? {}, null, 2)]];
  }
  return Object.entries(specifications).map(([key, value]) => [key.replace(/_/g, ' '), String(value)]);
}

function getBuildImages(build: BuildCard): string[] {
  const gallery = (build.images ?? []).map((i) => i.url);
  if (gallery.length > 0) return gallery;
  return build.imageUrl ? [build.imageUrl] : [];
}

// ─── Inline image carousel for the modal ────────────────────────────────────

function ModalCarousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  if (!images.length) return <div className="min-h-[260px] bg-zinc-900 sm:min-h-[320px]" />;

  return (
    <div className="flex flex-col">
      {/* Main image */}
      <div
        className="relative min-h-[220px] bg-zinc-900 sm:min-h-[320px]"
        style={{ backgroundImage: `url(${images[idx]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white hover:bg-black/80"
            >‹</button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-lg text-white hover:bg-black/80"
            >›</button>
            <div className="absolute bottom-2 right-3 rounded bg-black/60 px-2 py-0.5 text-xs text-white">
              {idx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto bg-zinc-950 p-2">
          {images.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`shrink-0 overflow-hidden rounded border-2 transition ${i === idx ? 'border-[#C8102E]' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-12 w-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BuildsClient({ builds }: { builds: BuildCard[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeBuild, setActiveBuild] = useState<BuildCard | null>(null);

  useEffect(() => {
    if (!activeBuild) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveBuild(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeBuild]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return builds;
    return builds.filter((build) => normalizeDiscipline(build.discipline) === activeFilter);
  }, [activeFilter, builds]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={
              activeFilter === filter
                ? 'rounded-full bg-[#C8102E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]'
                : 'rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300 hover:border-zinc-500'
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Build cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((build) => {
          const images = getBuildImages(build);
          const thumb = images[0] ?? '';
          return (
            <button
              key={build.id}
              type="button"
              className="section-shell overflow-hidden rounded-lg text-left transition hover:border-zinc-600 active:scale-[0.99]"
              onClick={() => setActiveBuild(build)}
            >
              <div
                className="relative aspect-video bg-zinc-900"
                style={thumb ? {
                  backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1)), url(${thumb})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : undefined}
              >
                {images.length > 1 && (
                  <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-300">
                    {images.length} photos
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-5">
                {build.discipline && (
                  <p className="inline-block rounded bg-[#C8102E] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]">
                    {build.discipline}
                  </p>
                )}
                <p className="mt-2 text-xs text-zinc-300 sm:text-sm">{build.caliber}</p>
                <h3 className="mt-1 text-base font-bold sm:text-xl">{build.name}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-[#C8102E] sm:mt-2">View Details →</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {activeBuild && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/85 sm:items-center sm:p-4"
          onClick={() => setActiveBuild(null)}
        >
          <div
            className="section-shell flex max-h-[95dvh] w-full flex-col overflow-hidden rounded-t-2xl sm:max-h-[92vh] sm:max-w-5xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="flex shrink-0 justify-center py-2 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-zinc-700" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-auto lg:flex-row">
              {/* Image carousel */}
              <div className="shrink-0 lg:w-[55%]">
                <ModalCarousel images={getBuildImages(activeBuild)} />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-4 overflow-auto p-5 lg:flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {activeBuild.discipline && (
                      <p className="inline-block rounded bg-[#C8102E] px-2 py-0.5 text-[11px] uppercase tracking-[0.16em]">
                        {activeBuild.discipline}
                      </p>
                    )}
                    <h3 className="mt-2 text-xl font-bold sm:text-2xl">{activeBuild.name}</h3>
                    <p className="mt-1 text-sm text-zinc-300">{activeBuild.caliber}</p>
                  </div>
                  <button type="button" className="btn-muted shrink-0 text-xs" onClick={() => setActiveBuild(null)}>
                    ✕ Close
                  </button>
                </div>

                <p className="text-sm leading-relaxed text-zinc-200">{activeBuild.description}</p>

                <div className="rounded-xl border border-zinc-800 bg-black/60 p-4">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">Specifications</h4>
                  <div className="grid gap-2 text-xs">
                    {specEntries(activeBuild.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0">
                        <span className="shrink-0 uppercase tracking-[0.14em] text-zinc-500">{key}</span>
                        <span className="text-right text-zinc-100">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/order?discipline=${encodeURIComponent(activeBuild.discipline)}&caliber=${encodeURIComponent(activeBuild.caliber)}`}
                  className="btn-primary mt-auto text-center text-sm"
                  onClick={() => setActiveBuild(null)}
                >
                  Build One Like This
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
