# GotXRing.com - Phase 1 Foundation

Premium cinematic rebuild of GotXRing.com for Competition Machine Inc using Next.js 14, TypeScript, Tailwind CSS, Prisma, Neon Postgres, Vercel Blob, and Resend.

This branch implements **Phase 1**:

- App foundation with branded dark theme (red/white/black only)
- Database schema for core content + order workflow
- Seed data for builds, champions, blog, press, RSS feeds, settings
- Password-protected admin with session cookie auth
- Full admin CRUD shell for required content types
- File image upload plumbing to Vercel Blob
- Public routes and page structure
- Order capture with DB save + admin/customer email flow

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma (`prisma-client-js` default generator)
- Neon Postgres (via `DATABASE_URL`)
- Vercel Blob (`@vercel/blob`)
- Resend email
- bcrypt-based admin auth (`bcryptjs`)

## Routes

### Public

- `/`
- `/builds`
- `/blog`
- `/blog/[slug]`
- `/order`
- `/admin` (redirects to admin content after auth)

### Admin sections

- `/admin/builds`
- `/admin/champions`
- `/admin/blog-posts`
- `/admin/press-items`
- `/admin/orders`
- `/admin/rss-feeds`
- `/admin/settings`
- `/admin/login`

## Admin authentication

- Username default: `garye`
- Password hash default (bcrypt for `SpR@ying395`) is included via env fallback
- Auth uses signed session cookie (`gotxring_admin_session`) using `SESSION_SECRET`
- `/admin/*` is guarded by middleware + server-side session checks

## Environment variables

Create `.env` from `.env.example`.

Required for full production behavior:

- `DATABASE_URL` - Neon Postgres connection string
- `SESSION_SECRET` - session signing secret (16+ chars)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token for file upload
- `RESEND_API_KEY` - Resend API key for order emails

Optional overrides:

- `ADMIN_USERNAME` (default `garye`)
- `ADMIN_PASSWORD_HASH` (default bcrypt hash for `SpR@ying395`)

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run migrations (or push schema) against your Neon DB:

```bash
npm run prisma:migrate -- --name init
```

5. Seed data:

```bash
npm run prisma:seed
```

6. Start dev server:

```bash
npm run dev
```

## Order submission behavior

The public `/order` form:

1. Saves order with status `Pending`
2. Emails admin notification to `Settings.notificationEmail`
3. Emails customer confirmation
4. Shows confirmation: `Your order has been received. We'll be in touch within 24 hours.`

Initial notification email defaults to `spraynandprayn@gmail.com` in seed/config paths.

## Image uploads

Admin forms for Builds, Champions, Blog Posts, and Press Items support file uploads:

- Accepted: `jpg`, `png`, `webp`
- Uploaded via `@vercel/blob`
- URL stored in relevant model record

## Vercel deployment notes

1. Import repository in Vercel
2. Set all environment variables from `.env.example`
3. Ensure `DATABASE_URL` points to Neon production DB
4. Run Prisma migration during deployment process
5. Verify Blob token + Resend key in production

## Phase 2 polish/deploy notes

Planned for next phase:

- Advanced UI polish/animation pass
- Better media fallback strategy and image optimization tuning
- Richer blog content rendering (MDX/structured blocks)
- RSS fetching job + ingestion automation
- More robust admin UX (inline feedback, pagination, sorting)
- Integration tests for auth/order/email flows
