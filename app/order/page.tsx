import { Prisma } from '@prisma/client';
import { Suspense } from 'react';

import { OrderForm } from '@/components/order-form';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Order | GotXRing'
};

export type ConfigGroup = Prisma.ConfigOptionGroupGetPayload<{
  include: { items: { orderBy: { sortOrder: 'asc' } } }
}>;

export default async function OrderPage() {
  const configGroups = await prisma.configOptionGroup.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-4xl font-bold uppercase">Order</h1>
      <p className="mt-3 max-w-2xl text-zinc-300">
        Configure your next precision rifle platform. Submit your requirements and our team will follow up with exact cost and delivery scheduling.
      </p>
      <div className="mt-8">
        <Suspense>
          <OrderForm configGroups={configGroups} />
        </Suspense>
      </div>
    </div>
  );
}
