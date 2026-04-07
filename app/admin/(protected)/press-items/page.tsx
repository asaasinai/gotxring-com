import { PressItem } from '@prisma/client';

export const dynamic = 'force-dynamic';

import { deletePressItemAction, upsertPressItemAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

function PressItemForm({ item }: { item?: PressItem }) {
  return (
    <form action={upsertPressItemAction} className="section-shell grid gap-3 rounded-lg p-4">
      <input type="hidden" name="id" defaultValue={item?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Title</label>
          <input className="input" name="title" required defaultValue={item?.title} />
        </div>
        <div>
          <label className="label">Publication</label>
          <input className="input" name="publication" required defaultValue={item?.publication} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">URL</label>
          <input className="input" name="url" required defaultValue={item?.url} />
        </div>
        <div>
          <label className="label">Category</label>
          <input className="input" name="category" required defaultValue={item?.category} />
        </div>
      </div>

      <div>
        <label className="label">Published At</label>
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
        <input type="checkbox" name="featured" defaultChecked={item?.featured} /> Featured
      </label>
      <button className="btn-primary w-fit">{item ? 'Update Press Item' : 'Create Press Item'}</button>
    </form>
  );
}

export default async function AdminPressItemsPage() {
  const items = await prisma.pressItem.findMany({ orderBy: { publishedAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Press Items</h1>
      <PressItemForm />
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
            <PressItemForm item={item} />
            <form action={deletePressItemAction}>
              <input type="hidden" name="id" value={item.id} />
              <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
