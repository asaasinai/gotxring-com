import { upsertContentAction } from '@/lib/actions';
import { CONTENT_KEYS, getManyContent } from '@/lib/content';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const [content, settings] = await Promise.all([
    getManyContent(Object.keys(CONTENT_KEYS) as (keyof typeof CONTENT_KEYS)[]),
    prisma.settings.findFirst(),
  ]);

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold">Site Text &amp; Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">Edit the text shown on various pages and manage site-wide settings.</p>
      </div>

      <form action={upsertContentAction} className="grid gap-6">
        {/* Builds Page */}
        <fieldset className="section-shell rounded-lg p-5">
          <legend className="px-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Builds Page</legend>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-1.5">
              <span className="label">Page Title</span>
              <input name="builds_title" className="input" defaultValue={content.builds_title} />
            </label>
            <label className="grid gap-1.5">
              <span className="label">Subtext</span>
              <textarea name="builds_subtext" rows={3} className="input resize-none" defaultValue={content.builds_subtext} />
            </label>
          </div>
        </fieldset>

        {/* Contact Page */}
        <fieldset className="section-shell rounded-lg p-5">
          <legend className="px-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Contact Page</legend>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-1.5">
              <span className="label">Page Title</span>
              <input name="contact_title" className="input" defaultValue={content.contact_title} />
            </label>
            <label className="grid gap-1.5">
              <span className="label">Subtext</span>
              <textarea name="contact_subtext" rows={3} className="input resize-none" defaultValue={content.contact_subtext} />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="label">Phone</span>
                <input name="contact_phone" className="input" defaultValue={content.contact_phone} placeholder="(555) 000-0000" />
              </label>
              <label className="grid gap-1.5">
                <span className="label">Email</span>
                <input name="contact_email" className="input" defaultValue={content.contact_email} placeholder="info@gotxring.com" />
              </label>
            </div>
            <label className="grid gap-1.5">
              <span className="label">Address</span>
              <textarea name="contact_address" rows={3} className="input resize-none" defaultValue={content.contact_address} placeholder="123 Main St&#10;City, ST 00000" />
            </label>
          </div>
        </fieldset>

        {/* Order / Lead Time */}
        <fieldset className="section-shell rounded-lg p-5">
          <legend className="px-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Order / Lead Time</legend>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="label">Lead Time</span>
              <input name="lead_time" className="input" defaultValue={content.lead_time} placeholder="e.g. 8–10 weeks" />
              <span className="text-[11px] text-zinc-500">Shown on the order form and in the sitewide footer banner.</span>
            </label>
            <label className="grid gap-1.5">
              <span className="label">Order Help Phone</span>
              <input name="order_phone" className="input" defaultValue={content.order_phone} placeholder="e.g. 928-649-0742" />
              <span className="text-[11px] text-zinc-500">Shown on the order form as "Need help ordering?"</span>
            </label>
          </div>
        </fieldset>

        {/* Notifications */}
        <fieldset className="section-shell rounded-lg p-5">
          <legend className="px-1 text-xs uppercase tracking-[0.2em] text-zinc-400">Notifications</legend>
          <div className="mt-4">
            <label className="grid gap-1.5 max-w-sm">
              <span className="label">Order Notification Email</span>
              <input
                name="notificationEmail"
                className="input"
                type="email"
                defaultValue={settings?.notificationEmail ?? ''}
                placeholder="you@example.com"
              />
              <span className="text-[11px] text-zinc-500">New order submissions are sent to this address.</span>
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn-primary w-full sm:w-fit">Save All Settings</button>
      </form>
    </div>
  );
}
