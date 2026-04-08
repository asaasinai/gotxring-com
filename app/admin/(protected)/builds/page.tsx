import { Prisma } from '@prisma/client';

import { deleteBuildAction } from '@/lib/actions';
import { BuildFormClient } from '@/components/build-form-client';
import { BuildGalleryManager } from '@/components/build-gallery-manager';
import { DeleteButton } from '@/components/delete-button';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type BuildWithImages = Prisma.BuildGetPayload<{ include: { images: true } }>;

export default async function AdminBuildsPage() {
  const builds = await prisma.build.findMany({
    orderBy: [{ category: 'asc' }, { subcategory: 'asc' }, { sortOrder: 'asc' }],
    include: { images: { orderBy: { sortOrder: 'asc' } } }
  });

  const grouped: Record<string, Record<string, BuildWithImages[]>> = {};
  for (const b of builds) {
    if (!grouped[b.category]) grouped[b.category] = {};
    const sub = b.subcategory || '—';
    if (!grouped[b.category][sub]) grouped[b.category][sub] = [];
    grouped[b.category][sub].push(b);
  }

  return (
    <div className="grid gap-8">
      <h1 className="text-3xl font-bold">Builds / Products</h1>

      {/* Add New — visually distinct with dashed border */}
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900/20 p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">＋ Add New Build</p>
        <BuildFormClient />
      </div>

      {builds.length === 0 && (
        <p className="text-sm text-zinc-500">No builds yet. Add your first one above.</p>
      )}

      {/* Existing builds — collapsed by default */}
      {Object.entries(grouped).map(([cat, subs]) => (
        <div key={cat}>
          <h2 className="mb-3 text-lg font-bold uppercase tracking-widest text-[#FF1A35]">{cat}</h2>
          {Object.entries(subs).map(([sub, items]) => (
            <div key={sub} className="mb-4">
              {sub !== '—' && <h3 className="mb-2 text-sm uppercase tracking-widest text-zinc-400">{sub}</h3>}
              <div className="grid gap-2">
                {items.map((build) => (
                  <details key={build.id} className="rounded-lg border border-zinc-800 bg-black/30">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 select-none">
                      <span className="font-semibold text-zinc-200">{build.name}</span>
                      <span className="shrink-0 text-zinc-500 inline-block transition-transform [[open]_&]:rotate-180">▾</span>
                    </summary>
                    <div className="border-t border-zinc-800 p-4 grid gap-4">
                      <BuildFormClient build={build} />
                      <BuildGalleryManager buildId={build.id} images={build.images} />
                      <DeleteButton action={deleteBuildAction} id={build.id} label={`"${build.name}"`} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
