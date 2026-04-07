import { Champion } from '@prisma/client';

import { deleteChampionAction, upsertChampionAction } from '@/lib/actions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function ChampionForm({ champion }: { champion?: Champion }) {
  return (
    <form action={upsertChampionAction} className="section-shell grid gap-3 rounded-lg p-4">
      <input type="hidden" name="id" defaultValue={champion?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" required defaultValue={champion?.name} />
        </div>
        <div>
          <label className="label">Title</label>
          <input className="input" name="title" required defaultValue={champion?.title} />
        </div>
      </div>
      <div>
        <label className="label">Quote</label>
        <input className="input" name="quote" required defaultValue={champion?.quote} />
      </div>
      <div>
        <label className="label">Achievements</label>
        <textarea className="input min-h-32" name="achievements" required defaultValue={champion?.achievements} />
      </div>
      <div>
        <label className="label">Loadout</label>
        <input className="input" name="loadout" required defaultValue={champion?.loadout} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Upload Image (jpg/png/webp)</label>
          <input className="input" type="file" accept="image/jpeg,image/png,image/webp" name="image" />
        </div>
        <div>
          <label className="label">Or image URL fallback</label>
          <input className="input" name="imageUrl" defaultValue={champion?.imageUrl ?? ''} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={champion?.featured} /> Featured
      </label>

      <button className="btn-primary w-fit">{champion ? 'Update Champion' : 'Create Champion'}</button>
    </form>
  );
}

export default async function AdminChampionsPage() {
  const champions = await prisma.champion.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Champions</h1>
      <ChampionForm />
      <div className="grid gap-4">
        {champions.map((champion) => (
          <div key={champion.id} className="grid gap-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
            <ChampionForm champion={champion} />
            <form action={deleteChampionAction}>
              <input type="hidden" name="id" value={champion.id} />
              <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
