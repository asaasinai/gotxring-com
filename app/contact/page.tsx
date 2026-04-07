import { getManyContent } from '@/lib/content';
import { ContactForm } from './contact-form';

export const metadata = {
  title: 'Contact | GotXRing'
};
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const content = await getManyContent(['contact_title', 'contact_subtext', 'contact_address', 'contact_phone', 'contact_email']);

  return (
    <div>
      <section className="border-b border-zinc-800 bg-[#111111]/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
          <h1 className="text-4xl font-bold uppercase">{content.contact_title}</h1>
          <p className="mt-3 max-w-3xl text-zinc-300">{content.contact_subtext}</p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="mb-6 text-xl font-bold uppercase tracking-[0.1em]">Send a Message</h2>
            <ContactForm />
          </div>

          <aside className="grid gap-6 self-start">
            <div className="section-shell rounded-lg p-6">
              <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-zinc-400">Competition Machine Inc</h3>
              <div className="grid gap-4 text-sm text-zinc-300">
                {content.contact_address && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Address</p>
                    <p className="mt-1 whitespace-pre-line">{content.contact_address}</p>
                  </div>
                )}
                {content.contact_phone && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Phone</p>
                    <p className="mt-1">{content.contact_phone}</p>
                  </div>
                )}
                {content.contact_email && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Email</p>
                    <a href={`mailto:${content.contact_email}`} className="mt-1 block text-white underline underline-offset-4">
                      {content.contact_email}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Response Time</p>
                  <p className="mt-1">Within 24 hours</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">New Build Requests</p>
                  <p className="mt-1">
                    Use the <a href="/order" className="text-white underline underline-offset-4">Order page</a> to configure a build.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
