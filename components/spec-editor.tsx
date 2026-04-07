'use client';

import { useState } from 'react';

type KV = { key: string; value: string };

function parseSpecs(specs: unknown): KV[] {
  if (specs && typeof specs === 'object' && !Array.isArray(specs)) {
    const entries = Object.entries(specs as Record<string, unknown>).map(([k, v]) => ({
      key: k,
      value: String(v ?? ''),
    }));
    if (entries.length > 0) return entries;
  }
  return [{ key: '', value: '' }];
}

export function SpecEditor({ defaultValue }: { defaultValue?: unknown }) {
  const [rows, setRows] = useState<KV[]>(parseSpecs(defaultValue));

  const json = JSON.stringify(
    Object.fromEntries(rows.filter((r) => r.key.trim()).map((r) => [r.key.trim(), r.value]))
  );

  function update(i: number, field: 'key' | 'value', val: string) {
    setRows((r) => r.map((x, j) => (j === i ? { ...x, [field]: val } : x)));
  }

  function remove(i: number) {
    setRows((r) => r.filter((_, j) => j !== i));
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <label className="label mb-0">Specifications</label>
        <span className="text-[11px] text-zinc-500">Shown on the product detail panel</span>
      </div>

      <div className="grid gap-1.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              className="input w-40 text-xs"
              placeholder="Label (e.g. Action)"
              value={row.key}
              onChange={(e) => update(i, 'key', e.target.value)}
            />
            <input
              className="input flex-1 text-xs"
              placeholder="Value (e.g. Custom billet receiver)"
              value={row.value}
              onChange={(e) => update(i, 'value', e.target.value)}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 px-2 text-zinc-600 hover:text-red-400 text-sm"
              title="Remove row"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRows((r) => [...r, { key: '', value: '' }])}
        className="w-fit text-xs text-zinc-400 hover:text-white"
      >
        + Add specification
      </button>

      {/* Hidden input read by upsertBuildAction */}
      <input type="hidden" name="specificationsText" value={json} />
    </div>
  );
}
