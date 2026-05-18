# Session Handoff - 2026-05-18

## Current Goal

Plan an application that helps consumers make better decisions about health functional foods and supplements. The product should reduce harm from exaggerated marketing, misleading use cases, and meaningless dosing.

The motivating examples from the user:

- Lutein has evidence around age-related macular degeneration, but is often bought by students or office workers for generic eye fatigue.
- Olive oil capsules may provide a dose so small that the health meaning is weak compared with normal dietary intake.
- The user wants consumers to understand whether the claim, use case, and dose actually make sense before buying.

## Repository State

This repository is still a scaffold. Only `AGENTS.md` existed before this session.

Changes made in this session:

- Added project workflow expectations to `AGENTS.md`.
- Set Superpowers as the default workflow layer.
- Required relevant gstack expert perspectives during brainstorming and planning.
- Required explicit planning-stage expert opinions in product and implementation plans.
- Required gstack CSO review after security-sensitive implementation work.
- Required `ce-compound` documentation when meaningful mistakes or recurring failure modes are discovered.

## Workflow Decisions

- Use Superpowers for the project by default.
- Use brainstorming before feature/product definition.
- During planning, include relevant gstack expert viewpoints:
  - CEO/product for problem framing and strategic scope.
  - Design for UX, trust, and consumer judgment surfaces.
  - Engineering for architecture, data flow, edge cases, and tests.
  - Developer experience when tooling or contributor workflows are involved.
- After security-sensitive work, run gstack CSO review before treating implementation as ready.
- If an agent makes a meaningful mistake or fixes a repeatable issue, document it with `ce-compound` under `docs/solutions/`.

## Brainstorming Status

The Superpowers brainstorming workflow was started.

Completed:

1. Explored project context. The repo is almost empty and has one prior commit.
2. Offered a visual companion for mockups and flow diagrams.
3. User accepted visual companion.
4. Tailscale access was checked.

Tailscale notes:

- `tailscale` CLI exists, but `tailscale ip -4` failed in the sandbox with "Failed to load preferences."
- `ifconfig` showed a Tailscale address on `utun6`: `100.113.73.104`.
- If a local visual companion or dev server is started later, bind it to `0.0.0.0` and access it from mobile at `http://100.113.73.104:<port>`.

## Open Product Question

The next unanswered question is the first MVP usage moment:

1. Purchase-prep search: users search an ingredient or product, such as "Should I buy lutein?" or "Does this product make sense?"
2. Product label check: users enter a product name, supplement facts, ad copy, or photo, and the app checks claims, evidence, and dose.
3. Goal-based misconception prevention: users enter a goal like eye fatigue, exam prep, skin, or liver health, and the app explains what is evidence-based and what is marketing.
4. Advertisement fact-check: users paste shopping mall, Instagram, or YouTube ad copy, and the app flags risky claims and likely consumer misunderstandings.

Ask the user to choose one before proposing approaches.

## Recommended Next Step

Resume with the Superpowers brainstorming flow:

1. Ask the open MVP usage-moment question above.
2. Continue clarifying questions one at a time.
3. Propose 2-3 product approaches with tradeoffs.
4. Include gstack planning expert opinions before finalizing the design.
5. Present the design for approval.
6. After approval, write the design spec under `docs/superpowers/specs/`.

Do not implement code until the design is approved.
