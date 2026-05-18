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

This is an early user-testable MVP. Product mode now works from product names, supported shopping links, pasted Supplement Facts text, and a best-effort NIH Dietary Supplement Label Database lookup.

Supported link reading currently targets Coupang, iHerb, and Naver Shopping through the local Vite server API. If a shopping site blocks fetching, the app falls back to readable URL/product-name extraction and asks for the ingredient label.

The judgment logic is rule-based rather than hardcoded sample output. It parses known ingredients and amounts, then applies official-source guidance for dose, goal fit, duplicate intake, interactions, and timing. Current evidence sources include NIH ODS, NCCIH, and the National Eye Institute.

Supported flows:

- Product link check
- Product name and pasted ingredient label check
- Best-effort Coupang, iHerb, and Naver Shopping page reading
- Best-effort NIH DSLD label lookup
- Goal-based consultation
- Advertisement or product-description interpretation
- Optional current supplement and medicine context
- Serving scenario check when relevant
- Intake timing guidance
- Expert view

## Static Hosting

Build output is written to `dist/`. The current link-reading API is implemented as Vite server middleware for local user testing; a production deployment should move `/api/parse-product` to the chosen host's serverless function format.
