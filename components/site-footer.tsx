export function SiteFooter({ leadTime = '8–10 weeks' }: { leadTime?: string }) {
  return (
    <footer className="border-t border-zinc-800">
      {/* Lead time banner */}
      <div className="bg-[#C8102E] px-4 py-3 text-center text-sm font-semibold text-white">
        Lead Time: {leadTime} — No payment required until your build is confirmed.
      </div>

      <div className="bg-black/70">
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:gap-16">
            {/* Brand */}
            <div className="flex flex-col gap-2 text-xs text-zinc-400 md:text-sm">
              <p className="tracking-[0.16em] text-zinc-300">COMPETITION MACHINE INC</p>
              <p>Custom precision rifle builds engineered for relentless consistency.</p>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4 text-xs text-zinc-400 md:text-sm">
              <div>
                <p className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">Mailing Address</p>
                <p className="text-zinc-300">Competition Machine Inc.</p>
                <p>PO Box 2308</p>
                <p>Cottonwood, AZ 86326</p>
              </div>
              <div>
                <p className="mb-1 text-[0.65rem] uppercase tracking-[0.18em] text-zinc-500">Phone</p>
                <a href="tel:9286490742" className="text-base font-semibold text-white transition hover:text-[#C8102E] md:text-sm md:font-normal md:text-zinc-300">
                  928-649-0742
                </a>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-zinc-600">© {new Date().getFullYear()} GotXRing.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
