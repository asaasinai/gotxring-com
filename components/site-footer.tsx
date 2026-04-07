export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-black/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-10 text-xs text-zinc-400 md:px-8 md:text-sm">
        <p className="tracking-[0.16em] text-zinc-300">COMPETITION MACHINE INC</p>
        <p>Custom precision rifle builds engineered for relentless consistency.</p>
        <p className="text-zinc-500">© {new Date().getFullYear()} GotXRing.com. All rights reserved.</p>
      </div>
    </footer>
  );
}
