'use client';

import { useEffect, useState } from 'react';

type ChampionCard = {
  id: string;
  name: string;
  title: string;
  quote: string;
  imageUrl: string | null;
  achievements: string;
  loadout: string;
};

export function ChampionsClient({ champions }: { champions: ChampionCard[] }) {
  const [activeChampion, setActiveChampion] = useState<ChampionCard | null>(null);

  useEffect(() => {
    if (!activeChampion) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveChampion(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeChampion]);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {champions.map((champion) => (
          <button
            key={champion.id}
            type="button"
            className="section-shell grid gap-4 rounded-lg p-5 text-left transition hover:border-zinc-600"
            onClick={() => setActiveChampion(champion)}
          >
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 rounded-full bg-zinc-900"
                style={{ backgroundImage: `url(${champion.imageUrl ?? ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div>
                <p className="text-sm text-zinc-300">{champion.title}</p>
                <h3 className="mt-1 text-xl font-semibold">{champion.name}</h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeChampion ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setActiveChampion(null)}>
          <div className="section-shell max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-5">
                <div
                  className="h-28 w-28 rounded-2xl bg-zinc-900"
                  style={{ backgroundImage: `url(${activeChampion.imageUrl ?? ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.16em] text-[#FF1A35]">Champions Circle</p>
                  <h3 className="mt-2 text-3xl font-bold">{activeChampion.name}</h3>
                  <p className="mt-1 text-zinc-300">{activeChampion.title}</p>
                </div>
              </div>
              <button type="button" className="btn-muted" onClick={() => setActiveChampion(null)}>
                Close
              </button>
            </div>

            {activeChampion.loadout && (
              <div className="mt-6 rounded-xl border border-zinc-800 bg-black/60 p-5">
                <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">Loadout</h4>
                <p className="mt-3 text-zinc-100">{activeChampion.loadout}</p>
              </div>
            )}

            <div className="mt-6 rounded-xl border border-zinc-800 bg-black/60 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-400">Achievements</h4>
              <p className="mt-3 whitespace-pre-wrap text-zinc-200">{activeChampion.achievements}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
