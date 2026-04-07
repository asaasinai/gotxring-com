import { Prisma } from '@prisma/client';

import { deleteBuildAction, upsertBuildAction } from '@/lib/actions';
import { BuildGalleryManager } from '@/components/build-gallery-manager';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type BuildWithImages = Prisma.BuildGetPayload<{ include: { images: true } }>;

const CATEGORIES = ['Full Rifle Systems', 'Chassis Systems'];

const SUBCATEGORIES: Record<string, string[]> = {
  'Full Rifle Systems': ['Centerfire', 'Rimfire'],
  'Chassis Systems': ['Remington 700 Pattern', 'Tikka T3/T3x', 'Barnard Model P', 'Other'],
};

function specsText(specs: unknown): string {
  return JSON.stringify(specs, null, 2);
}

function BuildForm({ build }: { build?: BuildWithImages }) {
  const category = build?.category ?? '';
  const subcategoryOptions = category ? (SUBCATEGORIES[category] ?? []) : Object.values(SUBCATEGORIES).flat();

  return (
    <form action={upsertBuildAction} className="grid gap-3">
      <input type="hidden" name="id" defaultValue={build?.id} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Category</label>
          <select className="input" name="category" required defaultValue={build?.category ?? ''}>
            <option value="">— select —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Subcategory</label>
          <select className="input" name="subcategory" defaultValue={build?.subcategory ?? ''}>
            <option value="">— none —</option>
            {subcategoryOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Sort Order</label>
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
          <input className="input" name="caliber" required defaultValue={build?.caliber} placeholder="e.g. 6.5 Creedmoor, .308, Rem 700 SA" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Chassis / Stock</label>
          <input className="input" name="chassisType" defaultValue={build?.chassisType ?? ''} placeholder="optional" />
        </div>
        <div>
          <label className="label">Discipline / Tag</label>
          <input className="input" name="discipline" defaultValue={build?.discipline ?? ''} placeholder="optional (e.g. F-Class, PRS)" />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-20" name="description" required defaultValue={build?.description} />
      </div>

      <ImageEditor urlInputName="imageUrl" currentUrl={build?.imageUrl} label="Cover Image (shown on catalog card)" />

      <div>
        <label className="label">Specifications (JSON key/value pairs)</label>
        <textarea
          className="input min-h-28 font-mono text-xs"
          name="specificationsText"
          required
          defaultValue={specsText(build?.specifications ?? { action: '', barrel: '', trigger: '', stock: '' })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={build?.featured} /> Featured
      </label>

      <button className="btn-primary w-fit">{build ? 'Update Build' : 'Create Build'}</button>
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
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Builds / Products</h1>

      <details className="section-shell rounded-lg p-4">
        <summary className="cursor-pointer text-sm font-semibold uppercase tracking-widest text-zinc-300">+ Add New Product</summary>
        <div className="mt-4"><BuildForm /></div>
      </details>

      {Object.entries(grouped).map(([cat, subs]) => (
        <div key={cat}>
          <h2 className="mb-3 text-lg font-bold uppercase tracking-widest text-[#C8102E]">{cat}</h2>
          {Object.entries(subs).map(([sub, items]) => (
            <div key={sub} className="mb-4">
              {sub !== '—' && <h3 className="mb-2 text-sm uppercase tracking-widest text-zinc-400">{sub}</h3>}
              <div className="grid gap-3">
                {items.map((build) => (
                  <div key={build.id} className="rounded-lg border border-zinc-800 bg-black/30 p-4">
                    <BuildForm build={build} />
                    <BuildGalleryManager buildId={build.id} images={build.images} />
                    <form action={deleteBuildAction} className="mt-3">
                      <input type="hidden" name="id" value={build.id} />
                      <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300 hover:border-red-700">
                        Delete Build
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
