import Link from 'next/link';

import { adminLogoutAction } from '@/lib/actions';

const tabs = [
  { href: '/admin/hero', label: 'Hero' },
  { href: '/admin/builds', label: 'Builds' },
  { href: '/admin/champions', label: 'Champions' },
  { href: '/admin/blog-posts', label: 'Blog Posts' },
  { href: '/admin/press-items', label: 'Press Items' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/rss-feeds', label: 'RSS Feeds' },
  { href: '/admin/content', label: 'Page Content' },
  { href: '/admin/settings', label: 'Settings' }
];

export function AdminNav() {
  return (
    <aside className="section-shell rounded-lg p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin Panel</p>
      <nav className="mt-3 grid gap-2">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className="rounded border border-zinc-800 px-3 py-2 text-sm hover:border-zinc-600">
            {tab.label}
          </Link>
        ))}
      </nav>
      <form action={adminLogoutAction} className="mt-5">
        <button className="btn-muted w-full">Logout</button>
      </form>
    </aside>
  );
}
