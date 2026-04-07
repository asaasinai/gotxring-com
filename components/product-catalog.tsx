'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

function BuildModal({ build, onClose }: { build: Build; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={onClose}>
      <div
        className="section-shell max-h-[92vh] w-full max-w-5xl overflow-auto rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
          {/* Image */}
          <div
            className="min-h-72 bg-zinc-900 lg:min-h-[480px]"
            style={build.imageUrl ? {
              backgroundImage: `url(${build.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : undefined}
          />
          {/* Details */}
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#C8102E]">{build.category}{build.subcategory ? ` · ${build.subcategory}` : ''}</p>
                <h2 className="mt-2 text-2xl font-bold leading-tight">{build.name}</h2>
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
                      <span className="uppercase tracking-[0.12em] text-zinc-500">{k}</span>
                      <span className="text-right text-zinc-100">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/order?system=${encodeURIComponent(build.name)}&category=${encodeURIComponent(build.category)}`}
              className="btn-primary mt-auto text-center text-sm"
            >
              Configure This System
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildCard({ build, onClick }: { build: Build; onClick: () => void }) {
  const specs = specEntries(build.specifications).slice(0, 3);
  return (
    <button
      type="button"
      onClick={onClick}
      className="group section-shell overflow-hidden rounded-xl text-left transition hover:border-zinc-500 hover:shadow-lg hover:shadow-black/40"
    >
      {/* Image */}
      <div
        className="relative aspect-[4/3] bg-zinc-900"
        style={build.imageUrl ? {
          backgroundImage: `linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.75)), url(${build.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        <div className="absolute inset-0 bg-[#C8102E]/0 transition group-hover:bg-[#C8102E]/5" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-sm font-bold leading-tight text-white drop-shadow-sm">{build.name}</h3>
          <p className="mt-0.5 text-xs text-zinc-300">{build.caliber}</p>
        </div>
      </div>
      {/* Specs preview */}
      {specs.length > 0 && (
        <div className="grid gap-1.5 p-3 text-xs">
          {specs.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-2">
              <span className="uppercase tracking-[0.1em] text-zinc-500">{k}</span>
              <span className="text-right text-zinc-300">{v}</span>
            </div>
          ))}
          <p className="mt-1 text-[10px] uppercase tracking-widest text-[#C8102E]">View Details →</p>
        </div>
      )}
    </button>
  );
}

export function ProductCatalog({ grouped }: { grouped: GroupedBuilds }) {
  const [active, setActive] = useState<Build | null>(null);

  if (!grouped.length) return null;

  return (
    <div className="grid gap-14">
      {grouped.map(({ category, subcategories }) => (
        <div key={category}>
          {/* Category header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-8 w-1 rounded-full bg-[#C8102E]" />
            <h2 className="text-2xl font-bold uppercase tracking-[0.1em]">{category}</h2>
          </div>

          <div className="grid gap-10">
            {subcategories.map(({ name: sub, builds }) => (
              <div key={sub}>
                {/* Subcategory header (only if there is one) */}
                {sub && (
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{sub}</span>
                    <div className="h-px flex-1 bg-zinc-800" />
                  </div>
                )}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {builds.map(build => (
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
