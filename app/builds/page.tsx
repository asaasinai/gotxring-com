import { BuildsClient } from '@/components/builds-client';
import { getManyContent } from '@/lib/content';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Builds | GotXRing'
};
export const dynamic = 'force-dynamic';

export default async function BuildsPage() {
  const [builds, content] = await Promise.all([
    prisma.build.findMany({ orderBy: { createdAt: 'desc' }, include: { images: { orderBy: { sortOrder: 'asc' } } } }),
    getManyContent(['builds_title', 'builds_subtext'])
  ]);

  return (
    <div>
      <section className="border-b border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <h1 className="text-4xl font-bold uppercase">{content.builds_title}</h1>
          <p className="mt-3 max-w-3xl text-zinc-300">{content.builds_subtext}</p>
        </div>
      </section>
      <BuildsClient builds={builds} />
    </div>
  );
}
