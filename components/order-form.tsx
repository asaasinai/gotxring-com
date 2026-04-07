'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { upsertOrderAction } from '@/lib/actions';

type FormState = {
  success?: string;
  error?: string;
};

const initialState: FormState = {};

export function OrderForm() {
  const params = useSearchParams();
  const [state, setState] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const discipline = params.get('discipline') || '';
  const caliber = params.get('caliber') || '';

  async function onSubmit(formData: FormData) {
    setPending(true);
    const result = await upsertOrderAction(formData);
    setState(result);
    setPending(false);
  }

  return (
    <div className="section-shell rounded-xl p-6 md:p-8">
      <form action={onSubmit} className="grid gap-4">
        <input type="hidden" name="discipline" value={discipline} />
        <input type="hidden" name="caliber" value={caliber} />
        <div>
          <label className="label" htmlFor="customerName">
            NAME *
          </label>
          <input id="customerName" name="customerName" required className="input" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">
              EMAIL *
            </label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phone">
              PHONE *
            </label>
            <input id="phone" name="phone" required className="input" />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="shippingAddress">
            FULL SHIPPING ADDRESS INCLUDING STREET, CITY AND ZIP *
          </label>
          <textarea id="shippingAddress" name="shippingAddress" required className="input min-h-24" />
        </div>

        <div>
          <label className="label" htmlFor="chassisModelOrPartModel">
            CHASSIS MODEL OR PART MODEL
          </label>
          <input id="chassisModelOrPartModel" name="chassisModelOrPartModel" className="input" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="handedness">
              RIGHT/LEFT FOR CHASSIS
            </label>
            <select id="handedness" name="handedness" className="input">
              <option value="">Select</option>
              <option value="Right">Right</option>
              <option value="Left">Left</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="finishColor">
              FINISH/COLOR FOR CHASSIS
            </label>
            <input id="finishColor" name="finishColor" className="input" />
          </div>
        </div>

        {discipline || caliber ? (
          <p className="rounded border border-zinc-700 bg-black px-3 py-2 text-sm text-zinc-300">
            Build context: {discipline || 'Custom'} {caliber ? `• ${caliber}` : ''}
          </p>
        ) : null}

        <div>
          <label className="label" htmlFor="options">
            OPTIONS
          </label>
          <textarea id="options" name="options" className="input min-h-20" />
        </div>

        <div>
          <label className="label" htmlFor="specialInstructions">
            SPECIAL INSTRUCTIONS
          </label>
          <textarea id="specialInstructions" name="specialInstructions" className="input min-h-20" />
        </div>

        <p className="text-sm text-zinc-300">
          We will contact you with cost and delivery schedule within 24 hours, no funds are required to place an order.
        </p>

        <button className="btn-primary" disabled={pending}>
          {pending ? 'Submitting...' : 'Submit Order'}
        </button>

        {state.error ? <p className="text-sm text-red-400">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-white">{state.success}</p> : null}
      </form>
    </div>
  );
}
