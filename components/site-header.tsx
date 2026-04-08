'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavLink = { href: string; label: string; children?: { href: string; label: string }[] };

const links: NavLink[] = [
  { href: '/', label: 'Home' },
  {
    href: '/builds',
    label: 'Builds',
    children: [
      { href: '/builds', label: 'All Builds' },
      { href: '/builds?category=Accessories', label: 'Accessories' },
    ],
  },
  { href: '/about', label: 'About' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/order', label: 'Order' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-sm font-bold tracking-[0.28em] text-white">
          GOT<span className="text-[#FF1A35]">XRING</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.16em] text-zinc-300 md:flex">
          {links.map((link) =>
            link.children ? (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 transition hover:text-[#FF1A35] ${pathname.startsWith(link.href) ? 'text-[#FF1A35]' : ''}`}
                >
                  {link.label}
                  <svg className="h-2.5 w-2.5 transition-transform group-hover:rotate-180" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <div className="absolute left-0 top-full hidden pt-2 group-hover:block">
                  <div className="min-w-[160px] rounded-lg border border-zinc-800 bg-black/95 py-1 shadow-xl backdrop-blur">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-xs uppercase tracking-[0.16em] text-zinc-300 transition hover:bg-zinc-900 hover:text-[#FF1A35]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`transition hover:text-[#FF1A35] ${pathname === link.href ? 'text-[#FF1A35]' : ''}`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          type="button"
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-all duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute inset-x-0 top-full border-t border-zinc-800 bg-black/95 md:hidden">
          <nav className="flex flex-col px-4 py-3">
            {links.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={`block border-b border-zinc-900 py-4 text-sm uppercase tracking-[0.2em] transition hover:text-[#FF1A35] ${pathname === link.href || (link.children && pathname.startsWith(link.href)) ? 'text-[#FF1A35]' : 'text-zinc-400'}`}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="mb-1 flex flex-col pl-4">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="border-b border-zinc-900/60 py-3 text-xs uppercase tracking-[0.2em] text-zinc-500 transition hover:text-[#FF1A35]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
