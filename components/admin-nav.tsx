'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { adminLogoutAction } from '@/lib/actions';

const tabs = [
  { href: '/admin/builds',      label: 'Builds / Products' },
  { href: '/admin/champions',   label: 'Champions' },
  { href: '/admin/blog-posts',  label: 'Blog Posts' },
  { href: '/admin/press-items', label: 'Press Items' },
  { href: '/admin/hero',        label: 'Homepage Banner' },
  { href: '/admin/content',     label: 'Site Text & Settings' },
  { href: '/admin/orders',      label: 'Orders', red: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="section-shell rounded-lg p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin Panel</p>
      <nav className="mt-3 grid gap-1.5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const isRed = 'red' in tab && tab.red;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded border px-3 py-2 text-sm transition ${
                isRed
                  ? isActive
                    ? 'border-[#C8102E] bg-[#C8102E]/20 text-white font-semibold'
                    : 'border-[#C8102E]/60 bg-[#C8102E]/10 text-[#C8102E] hover:bg-[#C8102E]/20'
                  : isActive
                  ? 'border-zinc-600 bg-zinc-800 text-white font-semibold'
                  : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <form action={adminLogoutAction} className="mt-5">
        <button className="btn-muted w-full text-sm">Logout</button>
      </form>
    </aside>
  );
}
