import { OrderQueue } from '@/components/order-queue';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  const active = orders.filter((o) => o.status !== 'Complete' && o.status !== 'Cancelled').length;
  const done = orders.filter((o) => o.status === 'Complete' || o.status === 'Cancelled').length;

  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Order Queue</h1>
        <span className="text-sm text-zinc-400">{active} active · {done} closed</span>
      </div>
      <OrderQueue orders={orders} />
    </div>
  );
}
