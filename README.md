# Inzozi Market

Inzozi Market is a modern Next.js marketplace frontend for discovering curated stays across Rwanda. It features polished landing content, sample listings, and a clean mobile-first design.

## What is included

- `app/page.tsx` — custom homepage with hero, feature cards, and listing previews
- `app/layout.tsx` — updated metadata and global layout
- `app/error.tsx` — friendly error fallback screen
- `app/not-found.tsx` — custom 404 page
- `app/globals.css` — Tailwind v4 styling and theme setup
- `next-env.d.ts` — Next.js TypeScript environment declarations
- `lib/listings.ts` — sample listing data and typed listing model
- `components/ListingCard.tsx` — reusable listing card component

## Development

Install dependencies and start the local dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm run start
```

## Notes

The current frontend is designed as a polished Inzozi marketplace prototype. It is ready to be extended with real listing data, booking flows, and authentication.
