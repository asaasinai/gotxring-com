'use client';

interface Props {
  action: (fd: FormData) => Promise<void>;
  id: string;
  label?: string;
  className?: string;
}

export function DeleteButton({ action, id, label = 'this item', className }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete ${label}? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={className ?? 'rounded-md border border-red-900 px-3 py-2 text-sm text-red-300 hover:bg-red-950/30'}
      >
        Delete
      </button>
    </form>
  );
}
