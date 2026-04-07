import { BuildsClient } from '@/components/builds-client';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Builds | GotXRing'
};
export const dynamic = 'force-dynamic';

export default async function BuildsPage() {
  const builds = await prisma.build.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <section className="border-b border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <h1 className="text-4xl font-bold uppercase">Builds</h1>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Explore mission-specific rifle systems from competition-ready F-Class platforms to rugged tactical configurations.
          </p>
        </div>
      </section>
      <BuildsClient builds={builds} />
    </div>
  );
}
