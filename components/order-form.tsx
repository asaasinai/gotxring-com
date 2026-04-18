'use client';

import { useState } from 'react';

import { upsertOrderAction } from '@/lib/actions';

type FormState = { success?: string; error?: string; orderId?: string };

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

const BASE_STEPS_BEFORE = ['Type', 'System', 'Build'];
const BASE_STEPS_AFTER = ['Info', 'Review'];

export type ConfigGroupForForm = {
  id: string;
  name: string;
  description: string;
  items: Array<{ id: string; label: string; description: string; imageUrl: string | null }>;
};

type Props = {
  initialOrderType?: 'Chassis System' | 'Full Rifle System' | '';
  initialSystem?: string;
  initialSubcategory?: 'Centerfire' | 'Rimfire' | '';
  initialCaliber?: string;
  initialDiscipline?: string;
  initialStep?: number;
  leadTime?: string;
  orderPhone?: string;
  configGroups?: ConfigGroupForForm[];
};

function StepIndicator({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="mb-6">
      {/* Mobile: current step name */}
      <div className="mb-3 flex items-center justify-between sm:hidden">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Step {current + 1} of {steps.length}</span>
        <span className="text-sm font-semibold text-white">{steps[current]}</span>
      </div>
      {/* Bubbles */}
      <div className="flex items-center overflow-x-auto pb-1">
        {steps.map((label, i) => (
          <div key={`${label}-${i}`} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i < current ? 'bg-[#FF1A35] text-white' :
                i === current ? 'border-2 border-[#FF1A35] text-[#FF1A35]' :
                'border border-zinc-700 text-zinc-600'
              }`}>
                {i < current ? '✓' : i + 1}
              </div>
              <span className={`hidden text-[10px] uppercase tracking-wider sm:block ${i === current ? 'text-white' : 'text-zinc-600'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-px w-8 sm:w-10 ${i < current ? 'bg-[#FF1A35]' : 'bg-zinc-800'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectCard({ label, desc, selected, onClick }: { label: string; desc?: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={`rounded-xl border p-5 text-left transition ${
        selected ? 'border-[#FF1A35] bg-[#FF1A35]/10 text-white' : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-600 hover:text-white'
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

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-400">{msg}</p>;
}

const ADDONS_START = 3; // first add-on step index (one step per ConfigOptionGroup)

export function OrderForm({
  initialOrderType = '',
  initialSystem = '',
  initialSubcategory = '',
  initialCaliber = '',
  initialDiscipline = '',
  initialStep = 0,
  leadTime = '8–10 weeks',
  orderPhone = '928-649-0742',
  configGroups = [],
}: Props) {
  const addonStepLabels = configGroups.map((_, i) => `Add-On ${i + 1}`);
  const STEPS = [...BASE_STEPS_BEFORE, ...addonStepLabels, ...BASE_STEPS_AFTER];
  const INFO_STEP = ADDONS_START + configGroups.length;
  const REVIEW_STEP = INFO_STEP + 1;
  const isAddonStep = (s: number) => s >= ADDONS_START && s < ADDONS_START + configGroups.length;
  const addonGroupAt = (s: number) => configGroups[s - ADDONS_START];

  const [step, setStep] = useState(Math.min(initialStep, REVIEW_STEP));
  const [state, setState] = useState<FormState>({});
  const [pending, setPending] = useState(false);

  const [orderType, setOrderType] = useState<'Chassis System' | 'Full Rifle System' | ''>(initialOrderType);
  const [subcategory, setSubcategory] = useState<'Centerfire' | 'Rimfire' | ''>(initialSubcategory);
  const [selectedSystem, setSelectedSystem] = useState(initialSystem);

  const [caliber, setCaliber] = useState(initialCaliber);
  const [handedness, setHandedness] = useState('');
  const [finishType, setFinishType] = useState('');
  const [colorName, setColorName] = useState('');
  const [discipline, setDiscipline] = useState(initialDiscipline);
  const [options, setOptions] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [configSelections, setConfigSelections] = useState<Record<string, string[]>>({});

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isFullRifle = orderType === 'Full Rifle System';
  const activeFinish = FINISH_OPTIONS.find((o) => o.value === finishType);
  const finishColor = finishType && colorName ? `${finishType} – ${colorName}` : finishType || colorName;

  function systemOptions() {
    if (orderType === 'Chassis System') return CHASSIS_SYSTEMS;
    if (subcategory === 'Centerfire') return CENTERFIRE_SYSTEMS;
    if (subcategory === 'Rimfire') return RIMFIRE_SYSTEMS;
    return [];
  }

  function validateInfo(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) errs.customerName = 'Required';
    if (!email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email address';
    if (!phone.trim()) errs.phone = 'Required';
    if (!shippingAddress.trim()) errs.shippingAddress = 'Required';
    return errs;
  }

  function canAdvance() {
    if (step === 0) return !!orderType;
    if (step === 1) {
      if (orderType === 'Chassis System') return !!selectedSystem;
      return !!subcategory && !!selectedSystem;
    }
    if (step === 2) return true;
    if (step === INFO_STEP) return !!customerName && !!email && !!phone && !!shippingAddress;
    return true;
  }

  function handleAdvance() {
    if (step === INFO_STEP) {
      const errs = validateInfo();
      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return;
      }
    }
    setFieldErrors({});
    setStep((s) => s + 1);
  }

  function clearError(key: string, value: string) {
    if (fieldErrors[key] && value.trim()) {
      setFieldErrors((prev) => { const p = { ...prev }; delete p[key]; return p; });
    }
  }

  // Build a { groupName: string[] } map of selected labels for submission + review rendering
  function selectionsByGroupName(): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const group of configGroups) {
      const ids = configSelections[group.id] ?? [];
      if (!ids.length) continue;
      const labels = ids
        .map((id) => group.items.find((i) => i.id === id)?.label)
        .filter((l): l is string => !!l);
      if (labels.length) out[group.name] = labels;
    }
    return out;
  }

  function toggleConfigItem(groupId: string, itemId: string) {
    setConfigSelections((prev) => {
      const current = prev[groupId] ?? [];
      const next = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];
      return { ...prev, [groupId]: next };
    });
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
    fd.append('configSelections', JSON.stringify(selectionsByGroupName()));
    const result = await upsertOrderAction(fd);
    setState(result);
    setPending(false);
  }

  if (state.success) {
    return (
      <div className="section-shell rounded-xl p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF1A35]/15 border border-[#FF1A35]/30">
          <span className="text-2xl text-[#FF1A35]">✓</span>
        </div>
        <h2 className="text-xl font-bold">Order Submitted</h2>
        {state.orderId && (
          <p className="mt-2 text-xs uppercase tracking-wider text-zinc-500">
            Reference: <span className="font-mono text-zinc-200">#{state.orderId.slice(0, 8).toUpperCase()}</span>
          </p>
        )}
        <p className="mt-3 text-zinc-300">{state.success}</p>
        <p className="mt-2 text-sm text-zinc-500">A confirmation has been sent to {email}.</p>
      </div>
    );
  }

  return (
    <div className="section-shell rounded-xl p-6 md:p-8">
      {/* Help line */}
      <div className="mb-5 flex items-center justify-between gap-2 text-sm">
        <span className="text-zinc-500">Need help ordering?</span>
        <a href={`tel:${orderPhone.replace(/\D/g, '')}`}
          className="font-semibold text-white transition hover:text-[#FF1A35]">
          Call {orderPhone}
        </a>
      </div>

      <StepIndicator current={step} steps={STEPS} />

      {/* Lead time note — visible on all steps before review */}
      {step < REVIEW_STEP && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-zinc-800 bg-black/30 px-4 py-3 text-xs text-zinc-400">
          <span className="mt-0.5 text-zinc-500">⏱</span>
          <span>
            Lead time: <strong className="text-zinc-200">{leadTime}</strong> — we confirm all pricing before any commitment.
          </span>
        </div>
      )}

      <div key={step} className="animate-step">

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
                  <div className="flex items-center gap-2 mb-1">
                    <label className="label mb-0">Color Name / Code</label>
                    {'href' in (activeFinish ?? {}) && activeFinish?.href && (
                      <a href={activeFinish.href} target="_blank" rel="noopener noreferrer"
                        className="rounded border border-[#FF1A35]/60 bg-[#FF1A35]/10 px-2 py-0.5 text-[11px] font-medium text-[#FF1A35] hover:bg-[#FF1A35]/20 transition">
                        Browse colors ↗
                      </a>
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

        {/* Add-On steps — one per ConfigOptionGroup */}
        {isAddonStep(step) && (() => {
          const group = addonGroupAt(step);
          if (!group) return null;
          const selected = configSelections[group.id] ?? [];
          const stepNum = step - ADDONS_START + 1;
          const totalAddons = configGroups.length;
          return (
            <div className="grid gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Add-On {stepNum} of {totalAddons} · Optional
                </p>
                <h2 className="mt-1 text-lg font-bold uppercase tracking-wide">{group.name}</h2>
                {group.description && (
                  <p className="mt-1 text-sm text-zinc-400">{group.description}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.items.map((item) => {
                  const isOn = selected.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleConfigItem(group.id, item.id)}
                      className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition ${
                        isOn ? 'border-[#FF1A35] bg-[#FF1A35]/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'
                      }`}
                    >
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.label}
                          className="h-56 w-full object-cover sm:h-64" />
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-zinc-800 text-xs uppercase tracking-wider text-zinc-600 sm:h-64">
                          No image
                        </div>
                      )}
                      <div className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md border backdrop-blur ${
                        isOn ? 'border-[#FF1A35] bg-[#FF1A35] text-white' : 'border-zinc-500 bg-black/60 text-transparent'
                      }`}>
                        <span className="text-sm leading-none">✓</span>
                      </div>
                      <div className="p-4">
                        <p className={`text-base font-semibold ${isOn ? 'text-white' : 'text-zinc-200'}`}>{item.label}</p>
                        {item.description && (
                          <p className="mt-1 text-sm text-zinc-400">{item.description}</p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selected.length > 0 && (
                <p className="text-xs text-zinc-500">
                  {selected.length} selected
                </p>
              )}
            </div>
          );
        })()}

        {/* Step 4 — Info */}
        {step === INFO_STEP && (
          <div className="grid gap-4">
            <h2 className="text-lg font-bold uppercase tracking-wide">Your Information</h2>
            <div>
              <label className="label">Full Name *</label>
              <input
                className={`input ${fieldErrors.customerName ? 'border-red-500 focus:border-red-500' : ''}`}
                value={customerName}
                onChange={(e) => { setCustomerName(e.target.value); clearError('customerName', e.target.value); }}
              />
              <FieldError msg={fieldErrors.customerName} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Email *</label>
                <input
                  className={`input ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError('email', e.target.value); }}
                />
                <FieldError msg={fieldErrors.email} />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input
                  className={`input ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); clearError('phone', e.target.value); }}
                />
                <FieldError msg={fieldErrors.phone} />
              </div>
            </div>
            <div>
              <label className="label">Full Shipping Address *</label>
              <textarea
                className={`input min-h-24 ${fieldErrors.shippingAddress ? 'border-red-500 focus:border-red-500' : ''}`}
                value={shippingAddress}
                onChange={(e) => { setShippingAddress(e.target.value); clearError('shippingAddress', e.target.value); }}
                placeholder="Street, City, State, ZIP"
              />
              <FieldError msg={fieldErrors.shippingAddress} />
            </div>
          </div>
        )}

        {/* Step 5 — Review */}
        {step === REVIEW_STEP && (
          <div className="grid gap-5">
            <h2 className="text-lg font-bold uppercase tracking-wide">Review & Submit</h2>
            <div className="rounded-xl border border-zinc-800 bg-black/40 p-5 text-sm divide-y divide-zinc-800/60">

              <div className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">System</span>
                  <button type="button" onClick={() => setStep(1)} className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-[#FF1A35] transition">Edit</button>
                </div>
                <div className="grid gap-0.5">
                  <Row label="Type" value={orderType} />
                  {subcategory && <Row label="Category" value={subcategory} />}
                  <Row label="System" value={selectedSystem} />
                </div>
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">Build Details</span>
                  <button type="button" onClick={() => setStep(2)} className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-[#FF1A35] transition">Edit</button>
                </div>
                <div className="grid gap-0.5">
                  {caliber && <Row label="Caliber" value={caliber} />}
                  {handedness && <Row label="Handedness" value={handedness} />}
                  {finishColor && <Row label="Finish" value={finishColor} />}
                  {discipline && <Row label="Discipline" value={discipline} />}
                  {options && <Row label="Options" value={options} />}
                  {specialInstructions && <Row label="Special Instructions" value={specialInstructions} />}
                  {!caliber && !handedness && !finishColor && !discipline && (
                    <p className="text-xs text-zinc-600 italic">No details specified — we will confirm before build starts</p>
                  )}
                </div>
              </div>

              {(() => {
                const sel = selectionsByGroupName();
                const entries = Object.entries(sel);
                if (!entries.length) return null;
                return (
                  <div className="py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500">Add-Ons</span>
                      <button type="button" onClick={() => setStep(ADDONS_START)} className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-[#FF1A35] transition">Edit</button>
                    </div>
                    <div className="grid gap-1">
                      {entries.map(([group, labels]) => (
                        <Row key={group} label={group} value={labels.join(', ')} />
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">Contact</span>
                  <button type="button" onClick={() => setStep(INFO_STEP)} className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-[#FF1A35] transition">Edit</button>
                </div>
                <div className="grid gap-0.5">
                  <Row label="Name" value={customerName} />
                  <Row label="Email" value={email} />
                  <Row label="Phone" value={phone} />
                  <Row label="Ship To" value={shippingAddress} />
                </div>
              </div>

            </div>
            <p className="text-sm text-zinc-400">No payment required. We will contact you within 24 hours with pricing and delivery timeline.</p>
            {state.error && <p className="text-sm text-red-400">{state.error}</p>}
            <button className="btn-primary py-3 text-base" disabled={pending} onClick={handleSubmit}>
              {pending ? 'Submitting...' : 'Submit Order Request →'}
            </button>
          </div>
        )}

      </div>{/* end animate-step */}

      {/* Navigation */}
      <div className={`mt-8 flex ${step > 0 ? 'justify-between' : 'justify-end'}`}>
        {step > 0 && (
          <button type="button" onClick={() => { setFieldErrors({}); setStep((s) => s - 1); }} className="btn-muted text-sm">← Back</button>
        )}
        {step < REVIEW_STEP && (
          <button
            type="button"
            disabled={!canAdvance()}
            onClick={handleAdvance}
            className={`btn-primary text-sm ${!canAdvance() ? 'cursor-not-allowed opacity-40' : ''}`}
          >
            {step === INFO_STEP - 1 ? 'Your Info →' : step === INFO_STEP ? 'Review Order →' : 'Continue →'}
          </button>
        )}
      </div>
    </div>
  );
}
