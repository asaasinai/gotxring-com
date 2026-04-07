import { PressItem } from '@prisma/client';

import { deletePressItemAction, upsertPressItemAction } from '@/lib/actions';
import { DeleteButton } from '@/components/delete-button';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function PressItemForm({ item }: { item?: PressItem }) {
  return (
    <form action={upsertPressItemAction} className="grid gap-3">
      <input type="hidden" name="id" defaultValue={item?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Article Title</label>
          <input className="input" name="title" required defaultValue={item?.title} />
        </div>
        <div>
          <label className="label">Publication</label>
          <input className="input" name="publication" required defaultValue={item?.publication} placeholder="e.g. Precision Shooting Journal" />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Article URL</label>
          <input className="input" name="url" required defaultValue={item?.url} placeholder="https://..." />
        </div>
        <div>
          <label className="label">Category</label>
          <input className="input" name="category" required defaultValue={item?.category} placeholder="e.g. Feature, Industry" />
        </div>
      </div>
      <div>
        <label className="label">Published Date</label>
        <input
          className="input"
          name="publishedAt"
          type="datetime-local"
          required
          defaultValue={item ? new Date(item.publishedAt).toISOString().slice(0, 16) : ''}
        />
      </div>
      <ImageEditor urlInputName="imageUrl" currentUrl={item?.imageUrl} label="Press Image" />
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={item?.featured} />
        Featured <span className="text-xs text-zinc-500">(shows on homepage)</span>
      </label>
      <button className="btn-primary w-fit">{item ? 'Save Changes' : 'Add Press Item'}</button>
    </form>
  );
}

export default async function AdminPressItemsPage() {
  const items = await prisma.pressItem.findMany({ orderBy: { publishedAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Press Items</h1>

      {/* Add New */}
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900/20 p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-300">＋ Add Press Coverage</p>
        <PressItemForm />
      </div>

      {/* Existing */}
      {items.length > 0 && (
        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-wider text-zinc-500">{items.length} press item{items.length !== 1 ? 's' : ''}</p>
          {items.map((item) => (
            <details key={item.id} className="rounded-lg border border-zinc-800 bg-black/30">
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-900/40 select-none">
                <div>
                  <span className="font-semibold text-zinc-200">{item.title}</span>
                  <span className="ml-2 text-xs text-zinc-500">{item.publication}</span>
                </div>
                <span className="text-xs text-zinc-500 shrink-0">Click to edit ▾</span>
              </summary>
              <div className="border-t border-zinc-800 p-4 grid gap-4">
                <PressItemForm item={item} />
                <DeleteButton action={deletePressItemAction} id={item.id} label={`"${item.title}"`} />
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
