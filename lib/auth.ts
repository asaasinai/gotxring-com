import bcrypt from 'bcryptjs';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


const SESSION_COOKIE = 'gotxring_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'local-build-session-secret-fallback';
}

function sign(data: string): string {
  return createHmac('sha256', getSessionSecret()).update(data).digest('hex');
}

function encodeSession(payload: SessionPayload): string {
  const raw = JSON.stringify(payload);
  const base = Buffer.from(raw, 'utf8').toString('base64url');
  const signature = sign(base);
  return `${base}.${signature}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [base, signature] = token.split('.');
  if (!base || !signature) {
    return null;
  }

  const expected = sign(base);
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  const parsed = JSON.parse(Buffer.from(base, 'base64url').toString('utf8')) as SessionPayload;
  if (!parsed.username || !parsed.expiresAt) {
    return null;
  }

  if (parsed.expiresAt < Date.now()) {
    return null;
  }

  return parsed;
}

export async function verifyAdminLogin(username: string, password: string): Promise<boolean> {
  if (username !== (process.env.ADMIN_USERNAME || 'garye')) {
    return false;
  }

  return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH || '$2b$12$oulMcKFXOdB9MsLDIjoPqOwXCUSm7cVuE8iNyr20DKJs908m/P3de');
}

export async function createAdminSession(username: string): Promise<void> {
  const payload: SessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000
  };

  const token = encodeSession(payload);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
}

export function clearAdminSession(): void {
  cookies().delete(SESSION_COOKIE);
}

export function getAdminSession(): SessionPayload | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  return decodeSession(token);
}

export function requireAdminSession(): SessionPayload {
  const session = getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}
