import { redirect } from 'next/navigation';

import { adminLoginAction } from '@/lib/actions';
import { getAdminSession } from '@/lib/auth';

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const session = getAdminSession();
  if (session) {
    redirect('/admin/builds');
  }

  async function login(formData: FormData) {
    'use server';
    const result = await adminLoginAction(formData);
    if (result.error) {
      redirect('/admin/login?error=1');
    }
    redirect('/admin/builds');
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12">
      <div className="section-shell w-full rounded-xl p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Admin Access</p>
        <h1 className="mt-2 text-3xl font-bold">Sign In</h1>

        <form action={login} className="mt-6 grid gap-4">
          <div>
            <label className="label" htmlFor="username">
              Username
            </label>
            <input id="username" name="username" className="input" required autoComplete="username" />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" className="input" required />
          </div>
          <button className="btn-primary">Login</button>
          {searchParams?.error ? <p className="text-sm text-red-400">Invalid credentials.</p> : null}
        </form>
      </div>
    </div>
  );
}
