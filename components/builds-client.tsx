'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const filters = ['All', 'F-Class', 'PRS', 'Benchrest', 'Tactical', 'Hunting', 'Sporting'];

type BuildCard = {
  id: string;
  name: string;
  description: string;
  discipline: string;
  caliber: string;
  chassisType: string;
  imageUrl: string | null;
  specifications: unknown;
};

function normalizeDiscipline(discipline: string): string {
  if (discipline === 'Long Range Hunter') {
    return 'Hunting';
  }
  return discipline;
}

export function BuildsClient({ builds }: { builds: BuildCard[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeBuild, setActiveBuild] = useState<BuildCard | null>(null);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') {
      return builds;
    }
    return builds.filter((build) => normalizeDiscipline(build.discipline) === activeFilter);
  }, [activeFilter, builds]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
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
          <article
            key={build.id}
            className="section-shell cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setActiveBuild(build)}
          >
            <div className="relative aspect-video bg-zinc-900" style={{ backgroundImage: `url(${build.imageUrl ?? ''})`, backgroundSize: 'cover' }} />
            <div className="p-5">
              <p className="inline-block rounded bg-[#C8102E] px-2 py-1 text-[11px] uppercase tracking-[0.16em]">
                {build.discipline}
              </p>
              <p className="mt-3 text-sm text-zinc-300">{build.caliber}</p>
              <h3 className="mt-1 text-xl font-bold">{build.name}</h3>
              <details className="mt-3 text-sm text-zinc-300">
                <summary className="cursor-pointer text-zinc-200">Specs</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded bg-black p-3 text-xs">{JSON.stringify(build.specifications, null, 2)}</pre>
              </details>
            </div>
          </article>
        ))}
      </div>

      {activeBuild ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setActiveBuild(null)}>
          <div className="section-shell max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl p-6" onClick={(event) => event.stopPropagation()}>
            <p className="text-xs uppercase tracking-[0.16em] text-[#C8102E]">{activeBuild.discipline}</p>
            <h3 className="mt-1 text-2xl font-bold">{activeBuild.name}</h3>
            <p className="mt-3 text-zinc-300">{activeBuild.description}</p>
            <div className="mt-4 rounded bg-black p-3 text-sm text-zinc-200">
              <pre className="whitespace-pre-wrap">{JSON.stringify(activeBuild.specifications, null, 2)}</pre>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                href={`/order?discipline=${encodeURIComponent(activeBuild.discipline)}&caliber=${encodeURIComponent(activeBuild.caliber)}`}
                className="btn-primary"
              >
                Build One Like This
              </Link>
              <button className="btn-muted" onClick={() => setActiveBuild(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
