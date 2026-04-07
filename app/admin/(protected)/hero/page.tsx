import { upsertHeroAction } from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminHeroPage() {
  const hero = await prisma.hero.findFirst({ orderBy: { updatedAt: 'desc' } });

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Homepage Banner</h1>
      <p className="text-sm text-zinc-400">Edit the headline, text, and background image shown at the top of the homepage.</p>
      <form action={upsertHeroAction} className="section-shell grid max-w-3xl gap-4 rounded-lg p-5">
        <input type="hidden" name="id" defaultValue={hero?.id} />
        <div>
          <label className="label">Headline</label>
          <input className="input" name="headline" required defaultValue={hero?.headline ?? 'Engineered for the Win.'} />
        </div>
        <div>
          <label className="label">Subheadline</label>
          <textarea className="input min-h-28" name="subheadline" required defaultValue={hero?.subheadline ?? 'Custom precision rifle systems built for decisive performance across F-Class, PRS, tactical, and long-range hunting disciplines.'} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">CTA Button Text</label>
            <input className="input" name="ctaButtonText" required defaultValue={hero?.ctaButtonText ?? 'Configure Your Build'} />
          </div>
          <div>
            <label className="label">CTA Button URL</label>
            <input className="input" name="ctaButtonUrl" required defaultValue={hero?.ctaButtonUrl ?? '/order'} />
          </div>
        </div>
        <ImageEditor urlInputName="backgroundImageUrl" currentUrl={hero?.backgroundImage} label="Background Image" />
        <button className="btn-primary w-fit">Save Changes</button>
      </form>
    </div>
  );
}
