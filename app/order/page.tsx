import { Suspense } from 'react';

import { OrderForm } from '@/components/order-form';

export const metadata = {
  title: 'Order | GotXRing'
};

export default function OrderPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-4xl font-bold uppercase">Order</h1>
      <p className="mt-3 max-w-2xl text-zinc-300">
        Configure your next precision rifle platform. Submit your requirements and our team will follow up with exact cost and delivery scheduling.
      </p>
      <div className="mt-8">
        <Suspense>
          <OrderForm />
        </Suspense>
      </div>
    </div>
  );
}
