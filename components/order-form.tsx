'use client';

import { useState } from 'react';

import { upsertOrderAction } from '@/lib/actions';

type FormState = { success?: string; error?: string };

const CHASSIS_SYSTEMS = [
  { id: 'rem700', name: 'Remington 700 Pattern Chassis', desc: 'Billet aluminum · SA/LA · F-Class / PRS / Benchrest' },
  { id: 'tikka', name: 'Tikka T3 Chassis', desc: 'Billet aluminum · Tikka T3/T3x · PRS' },
  { id: 'barnard', name: 'Barnard Model P Chassis', desc: 'Billet aluminum · Barnard Model P · Benchrest / F-Class' },
];

const CENTERFIRE_SYSTEMS = [
  { id: 'umr', name: 'Universal Match Rifle System (UMR)', desc: '6.5 Creedmoor / 6mm Dasher / .284 · F-Class / Long Range' },
  { id: 't3comp', name: 'T3 Competition Rifle', desc: '6mm Dasher / 6.5 Creedmoor · PRS / Precision Rifle' },
];

const RIMFIRE_SYSTEMS = [
  { id: '2500x', name: '2500x Rifle System', desc: '.22 LR · NRL22 / PRS Rimfire' },
  { id: 'umrr', name: 'Universal Match Rimfire Rifle System (UMRR)', desc: '.22 LR · Rimfire Benchrest / NRL22' },
];

const FINISH_OPTIONS = [
  { value: '', label: '— Select finish type —' },
  { value: 'Cerakote', label: 'Cerakote', href: 'https://www.cerakote.com/shop/cerakote-coating?finishes=cera_h_series' },
  { value: 'Powder Coat', label: 'Powder Coat', href: 'https://www.prismaticpowders.com/shop/powder-coating-colors' },
  { value: 'Other', label: 'Other / TBD' },
];

const BASE_STEPS = ['Type', 'System', 'Build', 'Info', 'Review'];

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center mb-8 overflow-x-auto pb-1">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i < current ? 'bg-[#C8102E] text-white' :
              i === current ? 'border-2 border-[#C8102E] text-[#C8102E]' :
              'border border-zinc-700 text-zinc-600'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`hidden text-[10px] uppercase tracking-wider sm:block ${i === current ? 'text-white' : 'text-zinc-600'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-2 h-px w-8 sm:w-10 ${i < current ? 'bg-[#C8102E]' : 'bg-zinc-800'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectCard({ label, desc, selected, onClick }: { label: string; desc?: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-xl border p-5 text-left transition ${
        selected ? 'border-[#C8102E] bg-[#C8102E]/10 text-white' : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600 hover:text-white'
      }`}>
      <p className="font-semibold">{label}</p>
      {desc && <p className="mt-1 text-xs text-zinc-400">{desc}</p>}
    </button>
  );
}


function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="shrink-0 text-[11px] uppercase tracking-wider text-zinc-500">{label}</span>
      <span className="text-right text-zinc-200">{value}</span>
    </div>
  );
}

export function OrderForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

  const [orderType, setOrderType] = useState<'Chassis System' | 'Full Rifle System' | ''>('');
  const [subcategory, setSubcategory] = useState<'Centerfire' | 'Rimfire' | ''>('');
  const [selectedSystem, setSelectedSystem] = useState('');

  const [caliber, setCaliber] = useState('');
  const [handedness, setHandedness] = useState('');
  const [finishType, setFinishType] = useState('');
  const [colorName, setColorName] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [options, setOptions] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const steps = BASE_STEPS;
  const infoStep = 3;
  const reviewStep = 4;

  const activeFinish = FINISH_OPTIONS.find((o) => o.value === finishType);
  const finishColor = finishType && colorName ? `${finishType} – ${colorName}` : finishType || colorName;
  const isFullRifle = orderType === 'Full Rifle System';

  function systemOptions() {
    if (orderType === 'Chassis System') return CHASSIS_SYSTEMS;
    if (subcategory === 'Centerfire') return CENTERFIRE_SYSTEMS;
    if (subcategory === 'Rimfire') return RIMFIRE_SYSTEMS;
    return [];
  }

  function canAdvance() {
    if (step === 0) return !!orderType;
    if (step === 1) {
      if (orderType === 'Chassis System') return !!selectedSystem;
      return !!subcategory && !!selectedSystem;
    }
    if (step === 2) return true;
    if (step === infoStep) return !!customerName && !!email && !!phone && !!shippingAddress;
    return true;
  }

  async function handleSubmit() {
    setPending(true);
    const fd = new FormData();
    fd.append('orderType', orderType);
    fd.append('selectedSystem', selectedSystem);
    fd.append('subcategory', subcategory);
    fd.append('caliber', caliber);
    fd.append('handedness', handedness);
    fd.append('finishColor', finishColor);
    fd.append('discipline', discipline);
    fd.append('options', options);
    fd.append('specialInstructions', specialInstructions);
    fd.append('customerName', customerName);
    fd.append('email', email);
    fd.append('phone', phone);
    fd.append('shippingAddress', shippingAddress);
    const result = await upsertOrderAction(fd);
    setState(result);
    setPending(false);
  }

  if (state.success) {
    return (
      <div className="section-shell rounded-xl p-10 text-center">
        <p className="text-4xl text-[#C8102E]">✓</p>
        <h2 className="mt-3 text-xl font-bold">Order Submitted</h2>
        <p className="mt-2 text-zinc-300">{state.success}</p>
      </div>
    );
  }

  return (
    <div className="section-shell rounded-xl p-6 md:p-8">
      <StepIndicator steps={steps} current={step} />

      {/* Step 0 — Type */}
      {step === 0 && (
        <div className="grid gap-4">
          <h2 className="text-lg font-bold uppercase tracking-wide">What are you ordering?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectCard label="Chassis System" desc="Billet aluminum chassis only — you supply the action"
              selected={orderType === 'Chassis System'}
              onClick={() => { setOrderType('Chassis System'); setSelectedSystem(''); setSubcategory(''); }} />
            <SelectCard label="Full Rifle System" desc="Complete custom precision rifle built to your specs"
              selected={orderType === 'Full Rifle System'}
              onClick={() => { setOrderType('Full Rifle System'); setSelectedSystem(''); setSubcategory(''); }} />
          </div>
        </div>
      )}

      {/* Step 1 — System */}
      {step === 1 && orderType === 'Full Rifle System' && !subcategory && (
        <div className="grid gap-4">
          <h2 className="text-lg font-bold uppercase tracking-wide">Centerfire or Rimfire?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectCard label="Centerfire" desc="Full-power competition calibers" selected={false} onClick={() => setSubcategory('Centerfire')} />
            <SelectCard label="Rimfire" desc=".22 LR — NRL22, PRS Rimfire, Benchrest" selected={false} onClick={() => setSubcategory('Rimfire')} />
          </div>
        </div>
      )}

      {step === 1 && (orderType === 'Chassis System' || (orderType === 'Full Rifle System' && !!subcategory)) && (
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            {orderType === 'Full Rifle System' && (
              <button type="button" onClick={() => { setSubcategory(''); setSelectedSystem(''); }} className="text-xs text-zinc-500 hover:text-white">← Back</button>
            )}
            <h2 className="text-lg font-bold uppercase tracking-wide">
              {orderType === 'Chassis System' ? 'Select Chassis' : `Select ${subcategory} System`}
            </h2>
          </div>
          <div className="grid gap-3">
            {systemOptions().map((sys) => (
              <SelectCard key={sys.id} label={sys.name} desc={sys.desc} selected={selectedSystem === sys.name} onClick={() => setSelectedSystem(sys.name)} />
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Build Details */}
      {step === 2 && (
        <div className="grid gap-4">
          <h2 className="text-lg font-bold uppercase tracking-wide">Build Configuration</h2>
          <p className="text-xs uppercase tracking-wider text-zinc-500">All fields optional — we confirm details before build starts</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Caliber</label>
              <input className="input" value={caliber} onChange={(e) => setCaliber(e.target.value)}
                placeholder={orderType === 'Chassis System' ? 'e.g. 6.5 Creedmoor' : 'e.g. 6mm Dasher'} />
            </div>
            <div>
              <label className="label">Handedness</label>
              <select className="input" value={handedness} onChange={(e) => setHandedness(e.target.value)}>
                <option value="">Select</option>
                <option value="Right">Right Hand</option>
                <option value="Left">Left Hand</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Finish Type</label>
              <select className="input" value={finishType} onChange={(e) => { setFinishType(e.target.value); setColorName(''); }}>
                {FINISH_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {finishType && (
              <div>
                <div className="flex items-center gap-2">
                  <label className="label">Color Name / Code</label>
                  {'href' in (activeFinish ?? {}) && activeFinish?.href && (
                    <a href={activeFinish.href} target="_blank" rel="noopener noreferrer"
                      className="mb-1 rounded border border-[#C8102E]/60 bg-[#C8102E]/10 px-2 py-0.5 text-[10px] text-[#C8102E] hover:bg-[#C8102E]/20">Browse ↗</a>
                  )}
                </div>
                <input className="input" value={colorName} onChange={(e) => setColorName(e.target.value)}
                  placeholder={finishType === 'Cerakote' ? 'e.g. Armor Black H-190' : finishType === 'Powder Coat' ? 'e.g. Flat Black' : 'Describe finish'} />
              </div>
            )}
          </div>
          <div>
            <label className="label">Discipline / Intended Use</label>
            <input className="input" value={discipline} onChange={(e) => setDiscipline(e.target.value)}
              placeholder="e.g. F-Class, PRS, Benchrest, Hunting" />
          </div>
          <div>
            <label className="label">Options / Upgrades</label>
            <textarea className="input min-h-20" value={options} onChange={(e) => setOptions(e.target.value)}
              placeholder="Trigger preference, rail, brake, stock adjustments, etc." />
          </div>
          <div>
            <label className="label">Special Instructions</label>
            <textarea className="input min-h-20" value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} />
          </div>
        </div>
      )}

      {/* Info step */}
      {step === infoStep && (
        <div className="grid gap-4">
          <h2 className="text-lg font-bold uppercase tracking-wide">Your Information</h2>
          <div>
            <label className="label">Full Name *</label>
            <input className="input" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Phone *</label>
              <input className="input" required value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Full Shipping Address *</label>
            <textarea className="input min-h-24" required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Street, City, State, ZIP" />
          </div>
        </div>
      )}

      {/* Review step */}
      {step === reviewStep && (
        <div className="grid gap-5">
          <h2 className="text-lg font-bold uppercase tracking-wide">Review & Submit</h2>
          <div className="rounded-xl border border-zinc-800 bg-black/40 p-5 grid gap-1 text-sm">
            <Row label="Order Type" value={orderType} />
            {subcategory && <Row label="Category" value={subcategory} />}
            <Row label="System" value={selectedSystem} />
            {caliber && <Row label="Caliber" value={caliber} />}
            {handedness && <Row label="Handedness" value={handedness} />}
            {finishColor && <Row label="Finish" value={finishColor} />}
            {discipline && <Row label="Discipline" value={discipline} />}
            {options && <Row label="Options" value={options} />}
            {specialInstructions && <Row label="Special Instructions" value={specialInstructions} />}
            <div className="my-2 border-t border-zinc-800" />
            <Row label="Name" value={customerName} />
            <Row label="Email" value={email} />
            <Row label="Phone" value={phone} />
            <Row label="Ship To" value={shippingAddress} />
          </div>
          <p className="text-sm text-zinc-400">No payment required. We will contact you within 24 hours with pricing and delivery timeline.</p>
          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          <button className="btn-primary" disabled={pending} onClick={handleSubmit}>
            {pending ? 'Submitting...' : 'Submit Order Request'}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className={`mt-8 flex ${step > 0 ? 'justify-between' : 'justify-end'}`}>
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-muted text-sm">← Back</button>
        )}
        {step < reviewStep && (
          <button type="button" disabled={!canAdvance()} onClick={() => setStep((s) => s + 1)}
            className={`btn-primary text-sm ${!canAdvance() ? 'cursor-not-allowed opacity-40' : ''}`}>
            {step === infoStep - 1 ? 'Your Info →' : step === infoStep ? 'Review Order →' : 'Continue →'}
          </button>
        )}
      </div>
    </div>
  );
}
