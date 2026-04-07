import { GalleryGrid } from '@/components/gallery-grid';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gallery | GotXRing — Competition Machine Inc',
  description: 'Photos from the shop floor — custom rifle builds, components, and competition work from Competition Machine Inc.',
};

export default async function GalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div>
      <section className="border-b border-zinc-800 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FF1A35]">Competition Machine Inc</p>
          <h1 className="mt-2 text-4xl font-bold uppercase md:text-5xl">Gallery</h1>
          <p className="mt-3 max-w-xl text-zinc-400">From the shop floor — builds, components, and competition work.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <GalleryGrid images={images} />
      </section>
    </div>
  );
}
