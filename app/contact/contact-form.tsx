'use client';

import { useState } from 'react';

import { submitContactAction } from '@/lib/actions';

type FormState = { success?: string; error?: string };

type Props = {
  imageUrl?: string;
  caption?: string;
};

export function ContactForm({ imageUrl, caption }: Props) {
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

  const hasImage = !!imageUrl;
  const defaultSubject = hasImage ? `Inquiry about: ${caption || 'gallery image'}` : '';
  const defaultMessage = hasImage
    ? `Hi, I saw this build in the gallery and I'd like to know more about it.\n\nImage: ${imageUrl}${caption ? `\nCaption: ${caption}` : ''}\n\n`
    : '';

  async function onSubmit(formData: FormData) {
    setPending(true);
    const result = await submitContactAction(formData);
    setState(result);
    setPending(false);
  }

  if (state.success) {
    return (
      <div className="rounded-lg border border-zinc-700 bg-[#111] p-8 text-center">
        <p className="text-lg font-semibold text-white">{state.success}</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="grid gap-5">
      {state.error && (
        <p className="rounded border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">{state.error}</p>
      )}

      {/* Gallery image reference */}
      {hasImage && (
        <div className="flex gap-4 rounded-lg border border-[#FF1A35]/40 bg-[#FF1A35]/5 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={caption || 'Gallery image'} className="h-20 w-24 shrink-0 rounded object-cover" />
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#FF1A35]">Asking about this build</p>
            {caption && <p className="mt-1 text-sm text-zinc-200">{caption}</p>}
            <p className="mt-1 truncate text-xs text-zinc-500">{imageUrl}</p>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Name *</span>
          <input name="name" required className="input" placeholder="John Smith" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Email *</span>
          <input name="email" type="email" required className="input" placeholder="you@example.com" />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Phone</span>
          <input name="phone" className="input" placeholder="(555) 000-0000" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Subject</span>
          <input name="subject" className="input" placeholder="Build inquiry, lead times, etc." defaultValue={defaultSubject} />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Message *</span>
        <textarea name="message" required rows={6} className="input resize-none" placeholder="Tell us about your project or question..." defaultValue={defaultMessage} />
      </label>
      <button type="submit" disabled={pending} className="btn-primary w-full md:w-auto md:justify-self-start">
        {pending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
