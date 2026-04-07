'use client';

import { useRef, useState } from 'react';

import { deleteGalleryImageAction, saveGalleryImageAction } from '@/lib/actions';

type GalleryItem = { id: string; url: string; caption: string; sortOrder: number };

type UploadState = { file: string; status: 'uploading' | 'done' | 'error'; error?: string };

export function GalleryUploader({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;

    const states: UploadState[] = arr.map((f) => ({ file: f.name, status: 'uploading' }));
    setUploads((prev) => [...prev, ...states]);

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const json = await res.json() as { url?: string; error?: string };
        if (!res.ok || !json.url) throw new Error(json.error ?? 'Upload failed');

        const result = await saveGalleryImageAction({ url: json.url, caption: '' });
        if (result) {
          setItems((prev) => [...prev, result]);
        }
        setUploads((prev) =>
          prev.map((u, idx) => (idx === prev.length - arr.length + i ? { ...u, status: 'done' } : u))
        );
      } catch (err) {
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === prev.length - arr.length + i
              ? { ...u, status: 'error', error: err instanceof Error ? err.message : 'Failed' }
              : u
          )
        );
      }
    }
  }

  async function updateCaption(id: string, caption: string) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await saveGalleryImageAction({ id, url: item.url, caption });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, caption } : i)));
  }

  async function handleDelete(id: string) {
    const fd = new FormData();
    fd.append('id', id);
    await deleteGalleryImageAction(fd);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  const activeUploads = uploads.filter((u) => u.status === 'uploading').length;

  return (
    <div className="grid gap-6">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
          dragging ? 'border-[#FF1A35] bg-[#FF1A35]/10' : 'border-zinc-700 hover:border-zinc-500'
        }`}
      >
        <p className="text-2xl">📷</p>
        <p className="mt-2 font-semibold text-zinc-200">Drop images here or click to select</p>
        <p className="mt-1 text-sm text-zinc-500">Accepts multiple files · JPG, PNG, WEBP</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {/* Upload progress */}
      {activeUploads > 0 && (
        <p className="text-sm text-zinc-400">
          Uploading {activeUploads} image{activeUploads !== 1 ? 's' : ''}…
        </p>
      )}

      {/* Image grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.caption || 'Gallery image'} className="w-full aspect-square object-cover" />
              <div className="p-2 grid gap-1.5">
                <input
                  type="text"
                  defaultValue={item.caption}
                  placeholder="Caption (optional)"
                  className="w-full rounded border border-zinc-700 bg-black px-2 py-1 text-xs text-zinc-200 outline-none focus:border-zinc-500"
                  onBlur={(e) => updateCaption(item.id, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-zinc-500 hover:text-red-400 transition text-left"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && activeUploads === 0 && (
        <p className="text-sm text-zinc-500">No gallery images yet. Upload some above.</p>
      )}
    </div>
  );
}
