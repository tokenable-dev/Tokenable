# Tokenable

Marketing landing on Next.js App Router, deployed on Netlify.

## Local dev

```bash
npm install
npm run dev
```

Set in `.env`:

- `NEXT_PUBLIC_FORMSPREE_WAITLIST_ENDPOINT` — Formspree form URL
- `NEXT_PUBLIC_WAITLIST_SHEETS_URL` — Apps Script web app URL (see `scripts/google-sheets-waitlist.gs`)
- `NEXT_PUBLIC_WAITLIST_SHEETS_SECRET` — same secret as in the Apps Script file

Waitlist submits to **Formspree** and **Google Sheets** in parallel (name, email, optional Telegram ID).

## Build

```bash
npm run build
```

Uses `@netlify/plugin-nextjs` (see `netlify.toml`).

## Landing assets

All runtime assets live under `public/landing/` (`document.html`, Three.js, dc-runtime, card textures, hero image).
