'use client';

import { useState } from 'react';

import { upsertBuildAction } from '@/lib/actions';
import { BuildCategorySelects } from '@/components/build-category-selects';
import { ImageEditor } from '@/components/image-editor';
import { SpecEditor } from '@/components/spec-editor';

type BuildImage = { id: string; url: string; sortOrder: number };

type Build = {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  discipline: string | null;
  chassisType: string | null;
  caliber: string;
  imageUrl: string | null;
  price: string | null;
  specifications: unknown;
  featured: boolean;
  sortOrder: number;
  images: BuildImage[];
};

type Props = { build?: Build };

export function BuildFormClient({ build }: Props) {
  const [imageUploading, setImageUploading] = useState(false);

  return (
    <form action={upsertBuildAction} className="grid gap-4">
      <input type="hidden" name="id" defaultValue={build?.id} />
      <div className="grid gap-3 sm:grid-cols-3">
        <BuildCategorySelects defaultCategory={build?.category} defaultSubcategory={build?.subcategory} />
        <div>
          <label className="label">
            Sort Order <span className="font-normal normal-case text-[10px] text-zinc-500">(lower = first)</span>
          </label>
          <input className="input" type="number" name="sortOrder" defaultValue={build?.sortOrder ?? 0} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Product Name</label>
          <input className="input" name="name" required defaultValue={build?.name} />
        </div>
        <div>
          <label className="label">Caliber / Type</label>
          <input className="input" name="caliber" required defaultValue={build?.caliber} placeholder="e.g. 6.5 Creedmoor" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Chassis / Stock</label>
          <input className="input" name="chassisType" defaultValue={build?.chassisType ?? ''} placeholder="optional" />
        </div>
        <div>
          <label className="label">Discipline / Tag</label>
          <input className="input" name="discipline" defaultValue={build?.discipline ?? ''} placeholder="e.g. F-Class, PRS" />
        </div>
        <div>
          <label className="label">
            Price <span className="font-normal normal-case text-[10px] text-zinc-500">(leave blank to hide)</span>
          </label>
          <input className="input" name="price" defaultValue={build?.price ?? ''} placeholder="e.g. $4,200" />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-20" name="description" required defaultValue={build?.description} />
      </div>
      <ImageEditor
        urlInputName="imageUrl"
        currentUrl={build?.imageUrl}
        label="Cover Image (shown on catalog card)"
        onUploadingChange={setImageUploading}
      />
      <SpecEditor defaultValue={build?.specifications} />
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={build?.featured} />
        Featured <span className="text-xs text-zinc-500">(shows on homepage)</span>
      </label>
      <button className="btn-primary w-fit" disabled={imageUploading}>
        {imageUploading ? 'Uploading image…' : build ? 'Save Changes' : 'Create Build'}
      </button>
    </form>
  );
}
