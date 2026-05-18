# Supplement Check Web Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first static web prototype that users can try through a browser link.

**Architecture:** Use Vite + React + TypeScript so the prototype can grow into a real product without rewriting the UI state model. Keep the domain sample judgment logic separate from React components so it can be tested and later replaced by real parsing/evidence APIs.

**Tech Stack:** Vite, React, TypeScript, Vitest, CSS.

---

## File Structure

- Create: `index.html`
  - Vite root document.
- Create: `package.json`
  - Scripts and dependencies for development, build, and tests.
- Create: `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`
  - TypeScript and Vite configuration.
- Create: `src/main.tsx`
  - React entry point.
- Create: `src/App.tsx`
  - App state, mode selection, input forms, and result composition.
- Create: `src/analysis.ts`
  - Sample judgment engine used by all three modes.
- Create: `src/analysis.test.ts`
  - Unit tests for mode-specific result generation.
- Create: `src/styles.css`
  - Mobile-first app-like visual design, responsive desktop layout, focus states, and transitions.
- Create: `README.md`
  - How to run locally and how to share via static hosting.
- Create: `README.md`
  - How to run locally and how to share via static hosting.

## Visual Direction

App-like mobile web. The first screen should feel like a focused consumer tool, not a marketing landing page. Use a calm off-white surface, ink text, one green accent for action, and compact rounded controls. Cards are used only for selectable modes and result sections.

## Tasks

### Task 1: Static App Shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] Create Vite React TypeScript scaffold.
- [ ] Create app shell with three modes: product link check, goal-based consultation, and ad interpretation.
- [ ] Add shared optional context fields for goal, current supplements, and current medicines.
- [ ] Run `npm install`.

### Task 2: Result Generator

**Files:**
- Create: `src/analysis.test.ts`
- Create: `src/analysis.ts`
- Modify: `src/App.tsx`

- [ ] Write failing Vitest tests for mode-specific sample outputs.
- [ ] Run tests and confirm they fail before implementation.
- [ ] Implement mode-specific sample outputs for product link, goal consultation, and ad interpretation.
- [ ] Show one-line conclusion, reason tags, dose analysis, overlap/interaction caution, intake timing, evidence, and expert view.
- [ ] Use conservative language for medicine interactions.
- [ ] Add UI controls for serving scenario only when the result benefits from it.

### Task 3: App-Like Visual Polish

**Files:**
- Modify: `src/styles.css`

- [ ] Make the UI mobile-first with a max-width app frame and clear touch targets.
- [ ] Add responsive desktop layout that keeps the app readable without becoming a landing page.
- [ ] Add hover, active, focus, and selected states.
- [ ] Ensure text does not overflow buttons or result sections.

### Task 4: Local Verification And README

**Files:**
- Create: `README.md`
- Modify: `index.html`
- Modify: `src/styles.css`
- Modify: `src/App.tsx`
- Modify: `src/analysis.ts`

- [ ] Document local run command.
- [ ] Document static hosting options.
- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Start local server and inspect the page.
- [ ] Commit the implementation.
