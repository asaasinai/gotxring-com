'use client';

import { useFormState } from 'react-dom';

import {
  deleteConfigGroupAction,
  deleteConfigItemAction,
  upsertConfigGroupAction,
  upsertConfigItemAction,
} from '@/lib/actions';
import { ImageEditor } from '@/components/image-editor';
import type { GroupWithItems } from '@/app/admin/(protected)/build-options/page';

type ActionResult = { success?: string; error?: string };
const init: ActionResult = {};

function SaveBanner({ state }: { state: ActionResult }) {
  if (!state.success && !state.error) return null;
  return (
    <p className={`rounded-lg px-3 py-2 text-sm ${state.success ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
      {state.success ?? state.error}
    </p>
  );
}

function ItemForm({ groupId, item }: { groupId: string; item?: GroupWithItems['items'][0] }) {
  const [state, action] = useFormState(upsertConfigItemAction, init);

  return (
    <form action={action} className="grid gap-2 rounded-lg border border-zinc-800 bg-black/30 p-3">
      <input type="hidden" name="id" defaultValue={item?.id ?? ''} />
      <input type="hidden" name="groupId" value={groupId} />
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="label">Label *</label>
          <input className="input" name="label" required defaultValue={item?.label} placeholder="e.g. Standard Lower Unit" />
        </div>
        <div>
          <label className="label">Sort Order</label>
          <input className="input" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-16" name="description" defaultValue={item?.description} placeholder="Brief description shown on order form" />
      </div>
      <div>
        <label className="label">Image</label>
        {item?.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.label} className="mb-2 h-24 w-36 rounded object-cover" />
        )}
        <ImageEditor urlInputName="imageUrl" currentUrl={item?.imageUrl ?? ''} label="Option Image" />
      </div>
      <div className="flex items-center gap-3">
        <button className="btn-primary text-sm">{item ? 'Save Item' : 'Add Item'}</button>
        <SaveBanner state={state} />
      </div>
    </form>
  );
}

function GroupSection({ group }: { group: GroupWithItems }) {
  const [groupState, groupAction] = useFormState(upsertConfigGroupAction, init);

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-5 grid gap-5">
      {/* Group edit form */}
      <form action={groupAction} className="grid gap-3">
        <input type="hidden" name="id" value={group.id} />
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <div>
            <label className="label">Group Name</label>
            <input className="input" name="name" required defaultValue={group.name} />
          </div>
          <div>
            <label className="label">Sort Order</label>
            <input className="input w-20" name="sortOrder" type="number" defaultValue={group.sortOrder} />
          </div>
          <div className="flex flex-col justify-end pb-0.5">
            <label className="label">Active</label>
            <input type="hidden" name="active" value="false" />
            <input type="checkbox" name="active" value="true" defaultChecked={group.active} className="mt-2 h-5 w-5 accent-[#C8102E]" />
          </div>
          <div className="flex items-end">
            <button className="btn-primary text-sm whitespace-nowrap">Save Group</button>
          </div>
        </div>
        <div>
          <label className="label">Description (shown on order form)</label>
          <textarea className="input min-h-16" name="description" defaultValue={group.description} />
        </div>
        <SaveBanner state={groupState} />
      </form>

      {/* Existing items */}
      <div className="grid gap-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">Options ({group.items.length})</p>
        {group.items.map((item) => (
          <div key={item.id} className="grid gap-1">
            <ItemForm groupId={group.id} item={item} />
            <form action={deleteConfigItemAction} onSubmit={(e) => {
              if (!confirm(`Remove "${item.label}"? This cannot be undone.`)) e.preventDefault();
            }}>
              <input type="hidden" name="id" value={item.id} />
              <button className="text-xs text-red-500 hover:text-red-300">Remove option</button>
            </form>
          </div>
        ))}
      </div>

      {/* Add new item */}
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-zinc-500">Add New Option</p>
        <ItemForm groupId={group.id} />
      </div>

      {/* Delete group */}
      <form action={deleteConfigGroupAction} onSubmit={(e) => {
        if (!confirm(`Delete the "${group.name}" group and all its options? This cannot be undone.`)) e.preventDefault();
      }}>
        <input type="hidden" name="id" value={group.id} />
        <button className="rounded-md border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/30">
          Delete Group
        </button>
      </form>
    </div>
  );
}

function NewGroupForm({ nextSort }: { nextSort: number }) {
  const [state, action] = useFormState(upsertConfigGroupAction, init);

  return (
    <div className="rounded-xl border border-dashed border-zinc-700 p-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">Add New Option Group</p>
      <form action={action} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Group Name *</label>
            <input className="input" name="name" required placeholder="e.g. Trigger Options" />
          </div>
          <div>
            <label className="label">Sort Order</label>
            <input className="input" name="sortOrder" type="number" defaultValue={nextSort} />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input min-h-16" name="description" placeholder="Brief description shown on order form" />
        </div>
        <input type="hidden" name="active" value="true" />
        <div className="flex items-center gap-3">
          <button className="btn-primary">Create Group</button>
          <SaveBanner state={state} />
        </div>
      </form>
    </div>
  );
}

export function BuildOptionsClient({ groups }: { groups: GroupWithItems[] }) {
  return (
    <div className="grid gap-6">
      {groups.map((group) => <GroupSection key={group.id} group={group} />)}
      <NewGroupForm nextSort={groups.length + 1} />
    </div>
  );
}
