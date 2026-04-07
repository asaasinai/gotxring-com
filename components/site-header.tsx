import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/builds', label: 'Builds' },
  { href: '/blog', label: 'Blog' },
  { href: '/order', label: 'Order' },
  { href: '/admin', label: 'Admin' }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-black/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="text-sm font-bold tracking-[0.28em] text-white">
          GOT<span className="text-[#C8102E]">XRING</span>
        </Link>
        <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-zinc-300 md:gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
