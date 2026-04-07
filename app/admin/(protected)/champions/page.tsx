import { Champion } from '@prisma/client';

import { deleteChampionAction, upsertChampionAction } from '@/lib/actions';
import { DeleteButton } from '@/components/delete-button';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function ChampionForm({ champion }: { champion?: Champion }) {
  return (
    <form action={upsertChampionAction} className="grid gap-3">
      <input type="hidden" name="id" defaultValue={champion?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" required defaultValue={champion?.name} />
        </div>
        <div>
          <label className="label">Title / Discipline</label>
          <input className="input" name="title" required defaultValue={champion?.title} placeholder="e.g. F-Class National Champion" />
        </div>
      </div>
      <div>
        <label className="label">Quote</label>
        <input className="input" name="quote" required defaultValue={champion?.quote} />
      </div>
      <div>
        <label className="label">Achievements</label>
        <textarea className="input min-h-24" name="achievements" required defaultValue={champion?.achievements} />
      </div>
      <div>
        <label className="label">Loadout <span className="font-normal normal-case text-[10px] text-zinc-500">(their Competition Machine setup)</span></label>
        <input className="input" name="loadout" required defaultValue={champion?.loadout} placeholder="e.g. 6.5 Creedmoor UMR" />
      </div>
      <ImageEditor urlInputName="imageUrl" currentUrl={champion?.imageUrl} label="Champion Photo" />
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={champion?.featured} />
        Featured <span className="text-xs text-zinc-500">(shows on homepage)</span>
      </label>
      <button className="btn-primary w-fit">{champion ? 'Save Changes' : 'Add Champion'}</button>
    </form>
  );
}

export default async function AdminChampionsPage() {
  const champions = await prisma.champion.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Champions</h1>

      {/* Add New */}
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900/20 p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">＋ Add New Champion</p>
        <ChampionForm />
      </div>

      {/* Existing */}
      {champions.length > 0 && (
        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-wider text-zinc-500">{champions.length} champion{champions.length !== 1 ? 's' : ''}</p>
          {champions.map((champion) => (
            <details key={champion.id} className="rounded-lg border border-zinc-800 bg-black/30">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 select-none">
                <span className="font-semibold text-zinc-200">{champion.name}</span>
                <span className="text-xs text-zinc-500 shrink-0">Click to edit ▾</span>
              </summary>
              <div className="border-t border-zinc-800 p-4 grid gap-4">
                <ChampionForm champion={champion} />
                <DeleteButton action={deleteChampionAction} id={champion.id} label={`"${champion.name}"`} />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
