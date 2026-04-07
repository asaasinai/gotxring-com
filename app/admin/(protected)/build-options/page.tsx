import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { BuildOptionsClient } from '@/components/build-options-client';

export const dynamic = 'force-dynamic';

export type GroupWithItems = Prisma.ConfigOptionGroupGetPayload<{
  include: { items: { orderBy: { sortOrder: 'asc' } } }
}>;

export default async function BuildOptionsPage() {
  const groups = await prisma.configOptionGroup.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold">Build Options</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Option groups shown on the Full Rifle System order form. Each group is one selection step.
        </p>
      </div>
      <BuildOptionsClient groups={groups} />
    </div>
  );
}
