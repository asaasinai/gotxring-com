import { Suspense } from 'react';

import { OrderForm } from '@/components/order-form';

export const metadata = {
  title: 'Order | GotXRing'
};

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

function str(v: string | string[] | undefined): string {
  return typeof v === 'string' ? v : '';
}

export default function OrderPage({ searchParams }: Props) {
  const rawCategory = str(searchParams.category);
  const orderType: 'Chassis System' | 'Full Rifle System' | '' =
    rawCategory.startsWith('Full') ? 'Full Rifle System' :
    rawCategory.startsWith('Chassis') ? 'Chassis System' : '';

  const selectedSystem = str(searchParams.system);

  // Infer subcategory: prefer explicit param, otherwise detect from system name
  const rawSub = str(searchParams.subcategory);
  const subcategory: 'Centerfire' | 'Rimfire' | '' =
    rawSub === 'Centerfire' ? 'Centerfire' :
    rawSub === 'Rimfire' ? 'Rimfire' :
    orderType === 'Full Rifle System' && selectedSystem
      ? (selectedSystem.toLowerCase().includes('rimfire') || selectedSystem.includes('2500x') ? 'Rimfire' : 'Centerfire')
      : '';

  const initialStep = orderType && selectedSystem ? 2 : orderType ? 1 : 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8">
      <h1 className="text-4xl font-bold uppercase">Order</h1>
      <p className="mt-3 max-w-2xl text-zinc-300">
        Configure your next precision rifle platform. Submit your requirements and our team will follow up with exact cost and delivery scheduling.
      </p>
      <div className="mt-8">
        <Suspense>
          <OrderForm
            initialOrderType={orderType}
            initialSystem={selectedSystem}
            initialSubcategory={subcategory}
            initialCaliber={str(searchParams.caliber)}
            initialDiscipline={str(searchParams.discipline)}
            initialStep={initialStep}
          />
        </Suspense>
      </div>
    </div>
  );
}
