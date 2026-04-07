import { Order } from '@prisma/client';

import { deleteOrderAction, updateOrderAction, upsertOrderAdminAction } from '@/lib/actions';
import { prisma } from '@/lib/prisma';

const statuses = ['Pending', 'In Review', 'Quoted', 'In Production', 'Shipped', 'Completed'];
export const dynamic = 'force-dynamic';

function OrderForm({ order }: { order?: Order }) {
  return (
    <form action={upsertOrderAdminAction} className="section-shell grid gap-3 rounded-lg p-4">
      <input type="hidden" name="id" defaultValue={order?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Customer Name</label>
          <input className="input" name="customerName" required defaultValue={order?.customerName} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" name="email" required defaultValue={order?.email} />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Phone</label>
          <input className="input" name="phone" required defaultValue={order?.phone} />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" name="status" defaultValue={order?.status || 'Pending'}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Shipping Address</label>
        <textarea className="input min-h-20" name="shippingAddress" required defaultValue={order?.shippingAddress} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Chassis/Part Model</label>
          <input className="input" name="chassisModelOrPartModel" defaultValue={order?.chassisModelOrPartModel ?? ''} />
        </div>
        <div>
          <label className="label">Handedness</label>
          <select className="input" name="handedness" defaultValue={order?.handedness ?? ''}>
            <option value="">Select</option>
            <option value="Right">Right</option>
            <option value="Left">Left</option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Finish/Color</label>
          <input className="input" name="finishColor" defaultValue={order?.finishColor ?? ''} />
        </div>
        <div>
          <label className="label">Discipline</label>
          <input className="input" name="discipline" defaultValue={order?.discipline ?? ''} />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Caliber</label>
          <input className="input" name="caliber" defaultValue={order?.caliber ?? ''} />
        </div>
        <div>
          <label className="label">Options</label>
          <textarea className="input min-h-20" name="options" defaultValue={order?.options ?? ''} />
        </div>
      </div>
      <div>
        <label className="label">Special Instructions</label>
        <textarea className="input min-h-20" name="specialInstructions" defaultValue={order?.specialInstructions ?? ''} />
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="input min-h-20" name="notes" defaultValue={order?.notes ?? ''} />
      </div>
      <button className="btn-primary w-fit">{order ? 'Update Order' : 'Create Order'}</button>
    </form>
  );
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Orders</h1>
      <OrderForm />

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
            <div className="section-shell rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Quick Status Update</p>
              <form action={updateOrderAction} className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                <input type="hidden" name="id" value={order.id} />
                <div>
                  <label className="label">Status</label>
                  <select className="input" name="status" defaultValue={order.status}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Notes</label>
                  <input className="input" name="notes" defaultValue={order.notes ?? ''} />
                </div>
                <button className="btn-primary">Save</button>
              </form>
            </div>

            <OrderForm order={order} />

            <form action={deleteOrderAction}>
              <input type="hidden" name="id" value={order.id} />
              <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
