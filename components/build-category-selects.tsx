'use client';

import { useState } from 'react';

const CATEGORIES = ['Full Rifle Systems', 'Chassis Systems', 'Accessories'];
const SUBCATEGORIES: Record<string, string[]> = {
  'Full Rifle Systems': ['Centerfire', 'Rimfire'],
  'Chassis Systems': ['Remington 700 Pattern', 'Tikka T3/T3x', 'Barnard Model P', 'Other'],
  'Accessories': [],
};

export function BuildCategorySelects({
  defaultCategory,
  defaultSubcategory,
}: {
  defaultCategory?: string;
  defaultSubcategory?: string;
}) {
  const [category, setCategory] = useState(defaultCategory ?? '');
  const subcategoryOptions = category ? (SUBCATEGORIES[category] ?? []) : Object.values(SUBCATEGORIES).flat();

  return (
    <>
      <div>
        <label className="label">Category</label>
        <select
          className="input"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">— select —</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Subcategory</label>
        <select className="input" name="subcategory" defaultValue={defaultSubcategory ?? ''}>
          <option value="">— none —</option>
          {subcategoryOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </>
  );
}
