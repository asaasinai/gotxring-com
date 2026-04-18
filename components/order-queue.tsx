'use client';

import { useState } from 'react';

import { deleteOrderAction, updateOrderAction, setBuildNumberAction } from '@/lib/actions';

const STATUSES = [
  'Quote Requested',
  'Quote Sent',
  'Deposit Received',
  'In Queue',
  'Parts Ordered',
  'In Build',
  'Quality Check',
  'Ready to Ship',
  'Shipped',
  'Complete',
  'Cancelled',
];

const STATUS_COLORS: Record<string, string> = {
  'Quote Requested':  'border-zinc-600 bg-zinc-800 text-zinc-200',
  'Quote Sent':       'border-blue-700 bg-blue-900/40 text-blue-200',
  'Deposit Received': 'border-green-700 bg-green-900/40 text-green-200',
  'In Queue':         'border-yellow-700 bg-yellow-900/30 text-yellow-200',
  'Parts Ordered':    'border-orange-700 bg-orange-900/30 text-orange-200',
  'In Build':         'border-[#FF1A35] bg-[#FF1A35]/20 text-red-200',
  'Quality Check':    'border-purple-700 bg-purple-900/30 text-purple-200',
  'Ready to Ship':    'border-teal-600 bg-teal-900/30 text-teal-200',
  'Shipped':          'border-cyan-600 bg-cyan-900/30 text-cyan-200',
  'Complete':         'border-green-500 bg-green-900/50 text-green-100',
  'Cancelled':        'border-red-900 bg-red-950/30 text-red-400',
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? 'border-zinc-700 bg-zinc-800 text-zinc-300';
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}

type HistoryEntry = { status: string; note: string; at: string };

type Order = {
  id: string;
  buildNumber: string | null;
  orderType: string;
  selectedSystem: string;
  subcategory: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  caliber: string | null;
  handedness: string | null;
  finishColor: string | null;
  discipline: string | null;
  options: string | null;
  specialInstructions: string | null;
  notes: string | null;
  configSelections: unknown;
  status: string;
  statusHistory: unknown;
  createdAt: Date;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="text-zinc-200">{value}</p>
    </div>
  );
}

function BuildNumberForm({ order }: { order: Order }) {
  const [value, setValue] = useState(order.buildNumber ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    const result = await setBuildNumberAction(fd);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1">
        <label className="label">Build # <span className="font-normal normal-case text-[10px] text-zinc-500">(unique identifier)</span></label>
        <input
          className="input font-mono tracking-wider uppercase"
          name="buildNumber"
          placeholder="e.g. CMI-001"
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          disabled={saving}
        />
        <input type="hidden" name="id" value={order.id} />
      </div>
      <button type="submit" className="btn-primary shrink-0" disabled={saving}>
        {saving ? 'Saving…' : 'Set'}
      </button>
      {saved && <span className="text-xs text-green-400 self-center">✓ Saved</span>}
      {error && <span className="text-xs text-red-400 self-center">{error}</span>}
    </form>
  );
}

function OrderCard({ order }: { order: Order }) {
  const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as HistoryEntry[];
  const isDone = order.status === 'Complete' || order.status === 'Cancelled';

  return (
    <div className={`grid gap-5 rounded-xl border p-5 ${isDone ? 'border-zinc-900 bg-black/20 opacity-70' : 'border-zinc-800 bg-black/40'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {order.buildNumber && (
            <p className="mb-0.5 font-mono text-xs font-bold tracking-[0.2em] text-[#FF1A35] uppercase">{order.buildNumber}</p>
          )}
          <p className="text-lg font-bold">{order.customerName}</p>
          <p className="text-sm text-zinc-400">{order.email} · {order.phone}</p>
          <p className="mt-1 text-xs text-zinc-500">Submitted {fmt(order.createdAt.toISOString())}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {!isDone && (
        <>
          <div className="grid gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              <Field label="Type" value={order.orderType} />
              <Field label="System" value={order.selectedSystem} />
              {order.subcategory && <Field label="Category" value={order.subcategory} />}
              {order.caliber && <Field label="Caliber" value={order.caliber} />}
              {order.handedness && <Field label="Handedness" value={order.handedness} />}
              {order.finishColor && <Field label="Finish" value={order.finishColor} />}
              {order.discipline && <Field label="Discipline" value={order.discipline} />}
            </div>
            {(() => {
              const sel = order.configSelections;
              if (!sel || typeof sel !== 'object' || Array.isArray(sel)) return null;
              const entries = Object.entries(sel as Record<string, unknown>)
                .map(([group, value]) => {
                  const labels = Array.isArray(value)
                    ? (value as unknown[]).filter((v): v is string => typeof v === 'string')
                    : typeof value === 'string' && value ? [value] : [];
                  return [group, labels] as const;
                })
                .filter(([, labels]) => labels.length > 0);
              if (!entries.length) return null;
              return (
                <div className="mt-2 border-t border-zinc-800 pt-2">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-500 mb-1">Add-On Selections</p>
                  <div className="grid gap-1">
                    {entries.map(([group, labels]) => (
                      <div key={group} className="text-xs">
                        <span className="font-semibold text-zinc-200">{group}:</span>
                        <span className="ml-1 text-zinc-400">{labels.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            {order.options && (
              <div className="mt-1 border-t border-zinc-800 pt-2">
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">Options</p>
                <p className="mt-0.5 text-zinc-300">{order.options}</p>
              </div>
            )}
            {order.specialInstructions && (
              <div className="mt-1 border-t border-zinc-800 pt-2">
                <p className="text-[11px] uppercase tracking-wider text-zinc-500">Special Instructions</p>
                <p className="mt-0.5 text-zinc-300">{order.specialInstructions}</p>
              </div>
            )}
            <div className="mt-1 border-t border-zinc-800 pt-2">
              <p className="text-[11px] uppercase tracking-wider text-zinc-500">Ship To</p>
              <p className="mt-0.5 whitespace-pre-line text-zinc-300">{order.shippingAddress}</p>
            </div>
          </div>

          <BuildNumberForm order={order} />

          <form
            action={updateOrderAction}
            className="grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end"
            onSubmit={(e) => {
              const form = e.currentTarget;
              const select = form.elements.namedItem('status') as HTMLSelectElement;
              const currentIdx = STATUSES.indexOf(order.status);
              const newIdx = STATUSES.indexOf(select.value);
              if (newIdx < currentIdx && select.value !== 'Cancelled') {
                if (!confirm(`Move status backwards from "${order.status}" to "${select.value}"?`)) {
                  e.preventDefault();
                }
              }
            }}
          >
            <input type="hidden" name="id" value={order.id} />
            <div>
              <label className="label">Update Status</label>
              <select className="input" name="status" defaultValue={order.status}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Note (optional)</label>
              <input className="input" name="note" placeholder="e.g. Awaiting barrel blank" />
            </div>
            <button className="btn-primary">Update</button>
          </form>

          {history.length > 0 && (
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wider text-zinc-500">Status History</p>
              <div className="grid gap-2">
                {[...history].reverse().map((h, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                    <span className="shrink-0 text-zinc-600">{fmt(h.at)}</span>
                    <StatusBadge status={h.status} />
                    {h.note && <span>{h.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {isDone && (
        <p className="text-xs text-zinc-500">
          {order.buildNumber && <span className="font-mono font-semibold text-zinc-400 mr-2">{order.buildNumber}</span>}
          {order.selectedSystem} · {fmt(order.createdAt.toISOString())}
        </p>
      )}

      {isDone && (
        <form
          action={deleteOrderAction}
          onSubmit={(e) => {
            if (!confirm(`Delete order for ${order.customerName}? This cannot be undone.`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={order.id} />
          <button className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/30">
            Delete Order
          </button>
        </form>
      )}
    </div>
  );
}

export function OrderQueue({ orders }: { orders: Order[] }) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const searched = query.trim()
    ? orders.filter((o) => {
        const q = query.toLowerCase();
        return (
          (o.buildNumber ?? '').toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.selectedSystem.toLowerCase().includes(q) ||
          o.orderType.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          (o.caliber ?? '').toLowerCase().includes(q) ||
          (o.discipline ?? '').toLowerCase().includes(q) ||
          (o.finishColor ?? '').toLowerCase().includes(q) ||
          (o.options ?? '').toLowerCase().includes(q) ||
          o.shippingAddress.toLowerCase().includes(q)
        );
      })
    : orders;

  const filtered = activeFilter
    ? searched.filter((o) => o.status === activeFilter)
    : searched;

  const active = filtered.filter((o) => o.status !== 'Complete' && o.status !== 'Cancelled');
  const done = filtered.filter((o) => o.status === 'Complete' || o.status === 'Cancelled');

  return (
    <div className="grid gap-8">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">⌕</span>
        <input
          className="input pl-8 w-full"
          placeholder="Search by build #, name, system, caliber, email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-sm">
            ✕
          </button>
        )}
      </div>

      {/* Pipeline tiles */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.filter((s) => s !== 'Cancelled').map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const isActive = activeFilter === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setActiveFilter(isActive ? null : s)}
              className={`min-w-[90px] rounded-lg border px-3 py-2 text-center transition ${
                STATUS_COLORS[s] ?? ''
              } ${isActive ? 'ring-2 ring-white/40 scale-105' : 'opacity-80 hover:opacity-100 hover:scale-[1.02]'}`}
            >
              <p className="text-lg font-bold">{count}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-80">{s}</p>
            </button>
          );
        })}
        {activeFilter && (
          <button
            type="button"
            onClick={() => setActiveFilter(null)}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-[11px] uppercase tracking-wider text-zinc-400 hover:text-white self-center"
          >
            Clear ✕
          </button>
        )}
      </div>

      {activeFilter && (
        <p className="text-sm text-zinc-400">
          Showing <span className="text-white font-semibold">{filtered.length}</span> order{filtered.length !== 1 ? 's' : ''} — {activeFilter}
        </p>
      )}

      {active.length > 0 && (
        <div className="grid gap-4">
          {!activeFilter && <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">Active Orders</h2>}
          {active.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}

      {done.length > 0 && (
        <div className="grid gap-4">
          {!activeFilter && <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-600">Closed Orders</h2>}
          {done.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}

      {filtered.length === 0 && orders.length > 0 && (
        <p className="text-sm text-zinc-500">
          No orders match{query ? ` "${query}"` : ''}{activeFilter ? ` in "${activeFilter}"` : ''}.
        </p>
      )}

      {orders.length === 0 && (
        <p className="text-sm text-zinc-500">No orders yet.</p>
      )}
    </div>
  );
}
