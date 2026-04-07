import { Prisma } from '@prisma/client';

import { deleteBuildAction, upsertBuildAction } from '@/lib/actions';
import { BuildGalleryManager } from '@/components/build-gallery-manager';
import { DeleteButton } from '@/components/delete-button';
import { ImageEditor } from '@/components/image-editor';
import { SpecEditor } from '@/components/spec-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type BuildWithImages = Prisma.BuildGetPayload<{ include: { images: true } }>;

const CATEGORIES = ['Full Rifle Systems', 'Chassis Systems'];
const SUBCATEGORIES: Record<string, string[]> = {
  'Full Rifle Systems': ['Centerfire', 'Rimfire'],
  'Chassis Systems': ['Remington 700 Pattern', 'Tikka T3/T3x', 'Barnard Model P', 'Other'],
};

function BuildForm({ build }: { build?: BuildWithImages }) {
  const category = build?.category ?? '';
  const subcategoryOptions = category ? (SUBCATEGORIES[category] ?? []) : Object.values(SUBCATEGORIES).flat();

  return (
    <form action={upsertBuildAction} className="grid gap-4">
      <input type="hidden" name="id" defaultValue={build?.id} />
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Category</label>
          <select className="input" name="category" required defaultValue={build?.category ?? ''}>
            <option value="">— select —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Subcategory</label>
          <select className="input" name="subcategory" defaultValue={build?.subcategory ?? ''}>
            <option value="">— none —</option>
            {subcategoryOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Chassis / Stock</label>
          <input className="input" name="chassisType" defaultValue={build?.chassisType ?? ''} placeholder="optional" />
        </div>
        <div>
          <label className="label">Discipline / Tag</label>
          <input className="input" name="discipline" defaultValue={build?.discipline ?? ''} placeholder="e.g. F-Class, PRS" />
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

      {/* Existing builds — collapsed by default */}
      {Object.entries(grouped).map(([cat, subs]) => (
        <div key={cat}>
          <h2 className="mb-3 text-lg font-bold uppercase tracking-widest text-[#C8102E]">{cat}</h2>
          {Object.entries(subs).map(([sub, items]) => (
            <div key={sub} className="mb-4">
              {sub !== '—' && <h3 className="mb-2 text-sm uppercase tracking-widest text-zinc-400">{sub}</h3>}
              <div className="grid gap-2">
                {items.map((build) => (
                  <details key={build.id} className="rounded-lg border border-zinc-800 bg-black/30">
                    <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 select-none">
                      <span className="font-semibold text-zinc-200">{build.name}</span>
                      <span className="text-xs text-zinc-500 shrink-0">Click to edit ▾</span>
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
