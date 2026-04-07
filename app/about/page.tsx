import { Dancing_Script } from 'next/font/google';

import { CONTENT_KEYS, getManyContent } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'About Us | GotXRing — Competition Machine Inc',
  description: 'The story behind Competition Machine Inc and the precision rifle builds that win championships.',
};

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['600'] });

export default async function AboutPage() {
  const content = await getManyContent(['about_featured_image', 'about_body', 'about_signature_image']);

  const bodyText = content.about_body || CONTENT_KEYS.about_body;
  const hasImage = !!content.about_featured_image;

  return (
    <div>
      {/* Page header */}
      <section className="border-b border-zinc-800 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C8102E]">Competition Machine Inc</p>
          <h1 className="mt-2 text-4xl font-bold uppercase md:text-5xl">About Us</h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className={`grid gap-12 ${hasImage ? 'lg:grid-cols-2 lg:gap-16 lg:items-start' : ''}`}>
          {/* Featured image */}
          {hasImage && (
            <div className="overflow-hidden rounded-xl border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.about_featured_image}
                alt="Gary — Competition Machine Inc"
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Text + signature */}
          <div className={hasImage ? '' : 'max-w-3xl'}>
            <div className="section-shell rounded-xl p-6 md:p-8">
              <p className="whitespace-pre-wrap leading-8 text-zinc-200">{bodyText}</p>

              {/* Signature */}
              <div className="mt-8 border-t border-zinc-700 pt-6">
                {content.about_signature_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.about_signature_image}
                    alt="Gary's signature"
                    className="h-14 w-auto object-contain"
                  />
                ) : (
                  <p className={`${dancingScript.className} text-4xl text-white`}>—Gary</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
