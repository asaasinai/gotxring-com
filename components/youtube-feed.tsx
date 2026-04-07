'use client';

import { useRef, useState } from 'react';

import type { YoutubeVideo } from '@/lib/youtube';

function formatVideoDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '';
  }
}

export function YoutubeFeed({ videos }: { videos: YoutubeVideo[] }) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!videos.length) return null;

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 304 : -304, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-black/80 text-white backdrop-blur transition hover:border-zinc-400 hover:bg-black md:-left-5"
        aria-label="Scroll left"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-black/80 text-white backdrop-blur transition hover:border-zinc-400 hover:bg-black md:-right-5"
        aria-label="Scroll right"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-3 px-1" style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none' }}>
      {videos.map((video) => (
        <div
          key={video.id}
          className="group shrink-0 w-72"
          style={{ scrollSnapAlign: 'start' }}
        >
          {playingId === video.id ? (
            <div className="grid gap-2">
              <div className="relative overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white leading-snug">{video.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{formatVideoDate(video.publishedAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlayingId(null)}
                  className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="w-full text-left grid gap-2 focus:outline-none"
              onClick={() => setPlayingId(video.id)}
            >
              <div className="relative overflow-hidden rounded-lg bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full object-cover transition duration-300 group-hover:opacity-80"
                  style={{ aspectRatio: '16/9' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition duration-200 group-hover:bg-[#FF1A35]/90">
                    <svg className="ml-1 h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-zinc-100 leading-snug group-hover:text-white transition">{video.title}</p>
              <p className="text-xs text-zinc-500">{formatVideoDate(video.publishedAt)}</p>
            </button>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
