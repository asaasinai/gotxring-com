import { GalleryUploader } from '@/components/gallery-uploader';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold">Gallery</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upload shop photos, build shots, and competition images. Drag &amp; drop multiple files at once.
          Captions are optional. Images appear on the homepage and the /gallery page.
        </p>
      </div>
      <GalleryUploader initial={images} />
    </div>
  );
}
