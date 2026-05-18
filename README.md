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

This is an early user-testable MVP. It does not yet perform reliable live parsing of Coupang, iHerb, or Naver Shopping pages because those pages can be dynamic, blocked, or inconsistent in a static browser app. Product mode now works from product names, links, pasted Supplement Facts text, and a best-effort NIH Dietary Supplement Label Database lookup.

The judgment logic is rule-based rather than hardcoded sample output. It parses known ingredients and amounts, then applies official-source guidance for dose, goal fit, duplicate intake, interactions, and timing. Current evidence sources include NIH ODS, NCCIH, and the National Eye Institute.

Supported flows:

- Product link check
- Product name and pasted ingredient label check
- Best-effort NIH DSLD label lookup
- Goal-based consultation
- Advertisement or product-description interpretation
- Optional current supplement and medicine context
- Serving scenario check when relevant
- Intake timing guidance
- Expert view

## Static Hosting

Build output is written to `dist/` and can be deployed to any static host such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.
