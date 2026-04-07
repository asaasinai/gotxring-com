'use client';

import { useState } from 'react';

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

  if (!videos.length) return null;

  return (
    <div className="divide-y divide-zinc-800 overflow-y-auto" style={{ maxHeight: '680px' }}>
      {videos.map((video) => (
        <div key={video.id} className="group px-0 py-5 first:pt-0 last:pb-0">
          {playingId === video.id ? (
            /* Embed */
            <div className="grid gap-3">
              <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white leading-snug">{video.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{formatVideoDate(video.publishedAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPlayingId(null)}
                  className="shrink-0 text-xs text-zinc-500 hover:text-zinc-300 transition"
                >
                  ✕ Close
                </button>
              </div>
            </div>
          ) : (
            /* Thumbnail card */
            <button
              type="button"
              className="w-full text-left grid gap-3 focus:outline-none"
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
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition duration-200 group-hover:bg-[#C8102E]/90">
                    <svg className="ml-1 h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-zinc-100 leading-snug group-hover:text-white transition">{video.title}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{formatVideoDate(video.publishedAt)}</p>
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
