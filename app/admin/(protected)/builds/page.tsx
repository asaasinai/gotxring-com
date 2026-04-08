import { Prisma } from '@prisma/client';

import { deleteBuildAction, upsertBuildAction } from '@/lib/actions';
import { BuildCategorySelects } from '@/components/build-category-selects';
import { BuildGalleryManager } from '@/components/build-gallery-manager';
import { DeleteButton } from '@/components/delete-button';
import { ImageEditor } from '@/components/image-editor';
import { SpecEditor } from '@/components/spec-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type BuildWithImages = Prisma.BuildGetPayload<{ include: { images: true } }>;

function BuildForm({ build }: { build?: BuildWithImages }) {
  return (
    <form action={upsertBuildAction} className="grid gap-4">
      <input type="hidden" name="id" defaultValue={build?.id} />
      <div className="grid gap-3 sm:grid-cols-3">
        <BuildCategorySelects defaultCategory={build?.category} defaultSubcategory={build?.subcategory} />
        <div>
          <label className="label">
            Sort Order <span className="font-normal normal-case text-[10px] text-zinc-500">(lower = first)</span>
          </label>
          <input className="input" type="number" name="sortOrder" defaultValue={build?.sortOrder ?? 0} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Product Name</label>
          <input className="input" name="name" required defaultValue={build?.name} />
        </div>
        <div>
          <label className="label">Caliber / Type</label>
          <input className="input" name="caliber" required defaultValue={build?.caliber} placeholder="e.g. 6.5 Creedmoor" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Chassis / Stock</label>
          <input className="input" name="chassisType" defaultValue={build?.chassisType ?? ''} placeholder="optional" />
        </div>
        <div>
          <label className="label">Discipline / Tag</label>
          <input className="input" name="discipline" defaultValue={build?.discipline ?? ''} placeholder="e.g. F-Class, PRS" />
        </div>
        <div>
          <label className="label">
            Price <span className="font-normal normal-case text-[10px] text-zinc-500">(leave blank to hide)</span>
          </label>
          <input className="input" name="price" defaultValue={build?.price ?? ''} placeholder="e.g. $4,200" />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-20" name="description" required defaultValue={build?.description} />
      </div>
      <ImageEditor urlInputName="imageUrl" currentUrl={build?.imageUrl} label="Cover Image (shown on catalog card)" />
      <SpecEditor defaultValue={build?.specifications} />
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={build?.featured} />
        Featured <span className="text-xs text-zinc-500">(shows on homepage)</span>
      </label>
      <button className="btn-primary w-fit">{build ? 'Save Changes' : 'Create Build'}</button>
    </form>
  );
}

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
        <BuildForm />
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
                      <BuildForm build={build} />
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
