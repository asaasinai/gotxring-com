'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const filters = ['All', 'F-Class', 'PRS', 'Benchrest', 'Tactical', 'Hunting', 'Sporting'];

type BuildCard = {
  id: string;
  name: string;
  description: string;
  discipline: string;
  caliber: string;
  chassisType: string;
  imageUrl: string | null;
  specifications: Record<string, unknown> | unknown;
};

function normalizeDiscipline(discipline: string): string {
  if (discipline === 'Long Range Hunter') return 'Hunting';
  return discipline;
}

function specEntries(specifications: BuildCard['specifications']) {
  if (!specifications || typeof specifications !== 'object' || Array.isArray(specifications)) {
    return [['Specs', JSON.stringify(specifications ?? {}, null, 2)]];
  }
  return Object.entries(specifications).map(([key, value]) => [key, String(value)]);
}

export function BuildsClient({ builds }: { builds: BuildCard[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeBuild, setActiveBuild] = useState<BuildCard | null>(null);

  useEffect(() => {
    if (!activeBuild) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveBuild(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeBuild]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return builds;
    return builds.filter((build) => normalizeDiscipline(build.discipline) === activeFilter);
  }, [activeFilter, builds]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={
              activeFilter === filter
                ? 'rounded-full bg-[#C8102E] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]'
                : 'rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300'
            }
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((build) => (
          <button
            key={build.id}
            type="button"
            className="section-shell overflow-hidden rounded-lg text-left transition hover:border-zinc-600"
            onClick={() => setActiveBuild(build)}
          >
            <div
              className="relative aspect-video bg-zinc-900"
              style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.1)), url(${build.imageUrl ?? ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="p-5">
              <p className="inline-block rounded bg-[#C8102E] px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
                {build.discipline}
              </p>
              <p className="mt-3 text-sm text-zinc-300">{build.caliber}</p>
              <h3 className="mt-1 text-xl font-bold">{build.name}</h3>
              <details className="mt-3 text-sm text-zinc-300">
                <summary className="cursor-pointer text-zinc-200">Quick specs</summary>
                <div className="mt-2 grid gap-2 rounded bg-black/70 p-3 text-xs">
                  {specEntries(build.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0">
                      <span className="uppercase tracking-[0.14em] text-zinc-500">{key}</span>
                      <span className="text-right text-zinc-100">{value}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </button>
        ))}
      </div>

      {activeBuild ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setActiveBuild(null)}>
          <div className="section-shell max-h-[92vh] w-full max-w-5xl overflow-auto rounded-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="min-h-[320px] bg-zinc-900" style={{ backgroundImage: `url(${activeBuild.imageUrl ?? ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-block rounded bg-[#C8102E] px-2 py-1 text-[11px] uppercase tracking-[0.16em]">{activeBuild.discipline}</p>
                    <h3 className="mt-3 text-3xl font-bold">{activeBuild.name}</h3>
                    <p className="mt-2 text-zinc-300">{activeBuild.caliber}</p>
                  </div>
                  <button type="button" className="btn-muted" onClick={() => setActiveBuild(null)}>
                    Close
                  </button>
                </div>

                <p className="mt-5 text-zinc-200">{activeBuild.description}</p>

                <div className="mt-6 rounded-xl border border-zinc-800 bg-black/60 p-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">Specifications</h4>
                  <div className="mt-3 grid gap-3 text-sm">
                    {specEntries(activeBuild.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-3 last:border-b-0 last:pb-0">
                        <span className="uppercase tracking-[0.14em] text-zinc-500">{key}</span>
                        <span className="text-right text-zinc-100">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/order?discipline=${encodeURIComponent(activeBuild.discipline)}&caliber=${encodeURIComponent(activeBuild.caliber)}`}
                  className="btn-primary mt-6 inline-flex"
                >
                  Build One Like This
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
