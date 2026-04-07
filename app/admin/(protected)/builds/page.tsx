import { Build } from '@prisma/client';

import { deleteBuildAction, upsertBuildAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

function specsText(specs: unknown): string {
  return JSON.stringify(specs, null, 2);
}

function BuildForm({ build }: { build?: Build }) {
  return (
    <form action={upsertBuildAction} className="section-shell grid gap-3 rounded-lg p-4">
      <input type="hidden" name="id" defaultValue={build?.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input className="input" name="name" required defaultValue={build?.name} />
        </div>
        <div>
          <label className="label">Discipline</label>
          <input className="input" name="discipline" required defaultValue={build?.discipline} />
        </div>
        <div>
          <label className="label">Chassis Type</label>
          <input className="input" name="chassisType" required defaultValue={build?.chassisType} />
        </div>
        <div>
          <label className="label">Caliber</label>
          <input className="input" name="caliber" required defaultValue={build?.caliber} />
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-20" name="description" required defaultValue={build?.description} />
      </div>

      <ImageEditor urlInputName="imageUrl" currentUrl={build?.imageUrl} label="Build Image" />

      <div>
        <label className="label">Specifications (JSON)</label>
        <textarea className="input min-h-28" name="specificationsText" required defaultValue={specsText(build?.specifications ?? {})} />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="featured" defaultChecked={build?.featured} /> Featured
      </label>

      <button className="btn-primary w-fit">{build ? 'Update Build' : 'Create Build'}</button>
    </form>
  );
}

export default async function AdminBuildsPage() {
  const builds = await prisma.build.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Builds</h1>
      <BuildForm />
      <div className="grid gap-4">
        {builds.map((build) => (
          <div key={build.id} className="grid gap-3 rounded-lg border border-zinc-800 bg-black/30 p-4">
            <BuildForm build={build} />
            <form action={deleteBuildAction}>
              <input type="hidden" name="id" value={build.id} />
              <button className="rounded-md border border-red-900 px-3 py-2 text-sm text-red-300">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
