# Supplement Check

Mobile-first web prototype for judging whether a health functional food or supplement makes sense for a user's goal.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The dev server binds to `0.0.0.0`, so a phone on the same network can open the machine IP and port.

## Test And Build

```bash
npm test -- --run
npm run build
```

## Prototype Scope

This is an early user-testable prototype. It does not yet parse live Coupang, iHerb, or Naver Shopping pages. The current app validates the interaction model and result format with sample judgment logic.

Supported flows:

- Product link check
- Goal-based consultation
- Advertisement or product-description interpretation
- Optional current supplement and medicine context
- Serving scenario check when relevant
- Intake timing guidance
- Expert view

## Static Hosting

Build output is written to `dist/` and can be deployed to any static host such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
