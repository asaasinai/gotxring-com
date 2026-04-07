'use client';

import { useState } from 'react';

import { submitContactAction } from '@/lib/actions';

type FormState = { success?: string; error?: string };

export function ContactForm() {
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

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
          <input name="subject" className="input" placeholder="Build inquiry, lead times, etc." />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">Message *</span>
        <textarea name="message" required rows={6} className="input resize-none" placeholder="Tell us about your project or question..." />
      </label>
      <button type="submit" disabled={pending} className="btn-primary w-full md:w-auto md:justify-self-start">
        {pending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
