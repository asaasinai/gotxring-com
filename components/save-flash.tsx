'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function SaveFlash() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const saved = params.get('saved');

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => router.replace(pathname), 3000);
    return () => clearTimeout(t);
  }, [saved, router, pathname]);

  if (!saved) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-green-700 bg-green-900/80 px-4 py-3 text-sm font-semibold text-green-200 shadow-xl backdrop-blur">
      <span className="text-green-400">✓</span>
      Saved successfully
    </div>
  );
}
