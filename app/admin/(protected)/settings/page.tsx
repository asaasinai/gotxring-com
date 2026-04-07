import { updateSettingsAction } from '@/lib/actions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <form action={updateSettingsAction} className="section-shell max-w-xl rounded-lg p-5">
        <label className="label" htmlFor="notificationEmail">
          Notification Email
        </label>
        <input
          id="notificationEmail"
          className="input"
          name="notificationEmail"
          type="email"
          required
          defaultValue={settings?.notificationEmail ?? 'spraynandprayn@gmail.com'}
        />
        <button className="btn-primary mt-4">Save Settings</button>
      </form>
    </div>
  );
}
