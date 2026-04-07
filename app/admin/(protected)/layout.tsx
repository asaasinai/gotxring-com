import { AdminNav } from '@/components/admin-nav';
import { requireAdminSession } from '@/lib/auth';

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  requireAdminSession();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-[240px_1fr] md:px-8">
      <AdminNav />
      <div>{children}</div>
    </div>
  );
}
