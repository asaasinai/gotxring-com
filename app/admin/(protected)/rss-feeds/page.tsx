import { RssFeed } from '@prisma/client';

import { deleteRssFeedAction, upsertRssFeedAction } from '@/lib/actions';
import { prisma } from '@/lib/prisma';

function RssFeedForm({ feed }: { feed?: RssFeed }) {
  return (
    <form action={upsertRssFeedAction} className="section-shell grid gap-3 rounded-lg p-4">
      <input type="hidden" name="id" defaultValue={feed?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" required defaultValue={feed?.name} />
        </div>
        <div>
          <label className="label">Category</label>
          <input className="input" name="category" required defaultValue={feed?.category} />
        </div>
      </div>
      <div>
        <label className="label">URL</label>
        <input className="input" name="url" required defaultValue={feed?.url} />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="active" defaultChecked={feed?.active} /> Active
      </label>
      <button className="btn-primary w-fit">{feed ? 'Update Feed' : 'Create Feed'}</button>
    </form>
  );
}

export default async function AdminRssFeedsPage() {
  const feeds = await prisma.rssFeed.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">RSS Feeds</h1>
      <RssFeedForm />
      <div className="grid gap-4">
        {feeds.map((feed) => (
          <div key={feed.id} className="grid gap-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
            <RssFeedForm feed={feed} />
            <p className="text-sm text-zinc-400">Items linked: {feed.items.length}</p>
            <form action={deleteRssFeedAction}>
              <input type="hidden" name="id" value={feed.id} />
              <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
