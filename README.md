# Tokenable

Marketing landing on Next.js App Router, deployed on Netlify.

## Local dev

```bash
npm install
npm run dev
```

Set in `.env` / Netlify:

- `NEXT_PUBLIC_FORMSPREE_WAITLIST_ENDPOINT` — Formspree form URL
- `WAITLIST_SHEETS_URL` — Apps Script web app URL (server-side, preferred)
- `WAITLIST_SHEETS_SECRET` — same secret as in Apps Script (server-side, preferred)
- `NEXT_PUBLIC_WAITLIST_SHEETS_URL` / `NEXT_PUBLIC_WAITLIST_SHEETS_SECRET` — optional fallback for the API route

Waitlist submits to **Formspree** and **Google Sheets** in parallel (name, email, optional Telegram ID). The browser calls `/api/waitlist`, which forwards to Apps Script server-side so Sheets success/failure is verified reliably.

## Build

```bash
npm run build
```

Uses `@netlify/plugin-nextjs` (see `netlify.toml`).

## Landing assets

All runtime assets live under `public/landing/` (`document.html`, Three.js, dc-runtime, card textures, hero image).
