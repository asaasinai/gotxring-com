'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Crop = { x: number; y: number; w: number; h: number };

interface Props {
  /** Name of the hidden text input that receives the uploaded URL */
  urlInputName: string;
  /** Existing image URL to show as preview */
  currentUrl?: string | null;
  label?: string;
}

export function ImageEditor({ urlInputName, currentUrl, label = 'Image' }: Props) {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState<Crop | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentUrl ?? '');
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Draw base image to canvas whenever rotation changes
  const redrawBase = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const rad = (rotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const w = img.naturalWidth * cos + img.naturalHeight * sin;
    const h = img.naturalWidth * sin + img.naturalHeight * cos;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    setCrop(null);
  }, [rotation]);

  useEffect(() => {
    if (imgSrc) {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        redrawBase();
      };
      img.src = imgSrc;
    }
  }, [imgSrc, redrawBase]);

  useEffect(() => {
    if (imgRef.current) redrawBase();
  }, [rotation, redrawBase]);

  // Draw crop overlay
  useEffect(() => {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    const ctx = overlay.getContext('2d')!;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    if (!crop) return;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, overlay.width, overlay.height);
    ctx.clearRect(crop.x, crop.y, crop.w, crop.h);
    ctx.strokeStyle = '#C8102E';
    ctx.lineWidth = 2;
    ctx.strokeRect(crop.x, crop.y, crop.w, crop.h);
    // Rule-of-thirds guides
    ctx.strokeStyle = 'rgba(200,16,46,0.4)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(crop.x + (crop.w * i) / 3, crop.y);
      ctx.lineTo(crop.x + (crop.w * i) / 3, crop.y + crop.h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(crop.x, crop.y + (crop.h * i) / 3);
      ctx.lineTo(crop.x + crop.w, crop.y + (crop.h * i) / 3);
      ctx.stroke();
    }
  }, [crop]);

  function scalePos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = (canvasRef.current?.width ?? 1) / rect.width;
    const scaleY = (canvasRef.current?.height ?? 1) / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setDragging(true);
    const pos = scalePos(e);
    setDragStart(pos);
    setCrop(null);
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging || !dragStart) return;
    const pos = scalePos(e);
    const x = Math.min(dragStart.x, pos.x);
    const y = Math.min(dragStart.y, pos.y);
    const w = Math.abs(pos.x - dragStart.x);
    const h = Math.abs(pos.y - dragStart.y);
    if (w > 4 && h > 4) setCrop({ x, y, w, h });
  }

  function onMouseUp() {
    setDragging(false);
    setDragStart(null);
  }

  function clearCrop() {
    setCrop(null);
    const overlay = overlayRef.current;
    if (overlay) {
      const ctx = overlay.getContext('2d')!;
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
  }

  async function applyAndUpload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setUploading(true);
    setError(null);

    const out = document.createElement('canvas');
    const ctx = out.getContext('2d')!;

    if (crop && crop.w > 4 && crop.h > 4) {
      out.width = crop.w;
      out.height = crop.h;
      ctx.drawImage(canvas, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
    } else {
      out.width = canvas.width;
      out.height = canvas.height;
      ctx.drawImage(canvas, 0, 0);
    }

    out.toBlob(async (blob) => {
      if (!blob) { setError('Failed to process image.'); setUploading(false); return; }
      const fd = new FormData();
      fd.append('file', new File([blob], 'upload.jpg', { type: 'image/jpeg' }));
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const json = await res.json() as { url?: string; error?: string };
        if (!res.ok || !json.url) throw new Error(json.error ?? 'Upload failed');
        setUploadedUrl(json.url);
        setPreview(json.url);
        setOpen(false);
        setImgSrc(null);
        setRotation(0);
        setCrop(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    }, 'image/jpeg', 0.92);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgSrc(ev.target?.result as string);
      setRotation(0);
      setCrop(null);
      setOpen(true);
      setError(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="grid gap-2">
      <label className="label">{label}</label>

      {preview && (
        <div className="relative w-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="h-20 w-32 rounded border border-zinc-700 object-cover" />
          <button
            type="button"
            className="absolute right-1 top-1 rounded bg-black/70 px-1 text-xs text-zinc-300 hover:text-white"
            onClick={() => { setPreview(null); setUploadedUrl(''); }}
          >✕</button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:border-zinc-500">
          {preview ? 'Replace Image' : 'Choose Image'}
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>
        {preview && (
          <button type="button" onClick={() => setOpen(true)} className="text-xs text-zinc-400 underline hover:text-white">
            Edit / Crop
          </button>
        )}
      </div>

      {/* Hidden URL input sent with the form */}
      <input type="hidden" name={urlInputName} value={uploadedUrl} readOnly />

      {/* Editor Modal */}
      {open && imgSrc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(false)}>
          <div className="flex max-h-[96vh] w-full max-w-4xl flex-col gap-4 overflow-auto rounded-2xl border border-zinc-700 bg-[#111] p-5"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Edit Image</h3>
              <button type="button" className="btn-muted text-sm" onClick={() => setOpen(false)}>Close</button>
            </div>

            <p className="text-xs text-zinc-400">Drag on the image to crop. Use rotate buttons to adjust orientation.</p>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" className="rounded border border-zinc-700 px-3 py-1.5 text-xs hover:border-zinc-400"
                onClick={() => setRotation((r) => r - 90)}>↺ Rotate Left</button>
              <button type="button" className="rounded border border-zinc-700 px-3 py-1.5 text-xs hover:border-zinc-400"
                onClick={() => setRotation((r) => r + 90)}>↻ Rotate Right</button>
              {crop && (
                <button type="button" className="rounded border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 hover:border-zinc-400"
                  onClick={clearCrop}>Clear Crop</button>
              )}
              <span className="ml-auto text-xs text-zinc-500">
                {crop ? `Crop: ${Math.round(crop.w)}×${Math.round(crop.h)}px` : 'No crop selected'}
              </span>
            </div>

            {/* Canvas area */}
            <div className="relative max-h-[55vh] overflow-auto rounded border border-zinc-800 bg-black">
              <div className="relative inline-block">
                <canvas ref={canvasRef} className="block max-w-full" style={{ maxHeight: '55vh' }} />
                <canvas
                  ref={overlayRef}
                  className="absolute inset-0 cursor-crosshair"
                  style={{ width: '100%', height: '100%' }}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center justify-end gap-3">
              <button type="button" className="btn-muted text-sm" onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" className="btn-primary text-sm" onClick={applyAndUpload} disabled={uploading}>
                {uploading ? 'Uploading…' : crop ? 'Apply Crop & Upload' : 'Upload As-Is'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
