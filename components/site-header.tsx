'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/builds', label: 'Builds' },
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
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-white ${pathname === link.href ? 'text-white' : ''}`}
            >
              {link.label}
            </Link>
          ))}
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
              <Link
                key={link.href}
                href={link.href}
                className={`border-b border-zinc-900 py-4 text-sm uppercase tracking-[0.2em] transition hover:text-white ${pathname === link.href ? 'text-white' : 'text-zinc-400'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
