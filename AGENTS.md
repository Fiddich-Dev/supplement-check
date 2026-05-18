# Repository Guidelines

## Agent Workflow Expectations

Use Superpowers as the default workflow layer for this project. Before substantive work, check whether a Superpowers skill applies and follow it when relevant. In particular, use brainstorming before creative or feature-definition work, systematic debugging before bug fixes, test-driven development when implementing behavior, and verification before claiming work is complete.

During brainstorming and planning, bring in the relevant gstack expert perspectives before settling on an implementation direction. Use the smallest useful set of reviewers for the task, such as CEO/product review for problem framing, design review for UX and visual decisions, engineering review for architecture and execution risk, and developer-experience review for tooling or contributor workflows. Summarize their concrete objections, tradeoffs, and recommendations in the plan rather than treating them as ceremonial approval.

When creating a product or implementation plan, explicitly include the opinions of the gstack experts that participate in the planning phase. Capture each relevant expert's stance, concerns, and recommended changes before finalizing the plan, especially from CEO/product, design, engineering, and developer-experience perspectives when those domains are involved.

After implementing security-sensitive changes, run a gstack CSO review before considering the work ready. Treat authentication, authorization, user health data, supplement databases, API keys, file uploads, external APIs, dependency changes, CI/CD, LLM prompts or tool calls, and data storage as security-sensitive. For small purely presentational changes, a full CSO pass is optional, but still run the normal verification workflow.

When an agent makes a meaningful mistake, discovers a recurring failure mode, or fixes a problem that future agents are likely to repeat, document it with the Compound Engineering `ce-compound` workflow. Store durable learnings under `docs/solutions/` with searchable frontmatter so future work can find the lesson before repeating the same mistake.

## Project Structure & Module Organization

This repository is currently a clean scaffold with no source files committed yet. As the project grows, keep the layout predictable:

- `src/` for application code and domain logic.
- `tests/` for automated tests that mirror `src/` paths.
- `assets/` for static data, images, fixtures, or supplement reference files.
- `docs/` for product notes, architecture decisions, and contributor-facing documentation.

Prefer small modules with clear ownership. For example, place supplement parsing logic in `src/supplements/` and related tests in `tests/supplements/`.

## Build, Test, and Development Commands

No build system or package manager files are present yet. When adding tooling, document the canonical commands here and keep them stable. Suggested command names:

- `npm install`, `pnpm install`, or equivalent: install dependencies.
- `npm run dev`: run the local development server or watcher.
- `npm test`: run the full automated test suite.
- `npm run lint`: check formatting, imports, and static analysis rules.
- `npm run build`: create a production-ready build.

If a different ecosystem is chosen, use its standard equivalents and update this section in the same change.

## Coding Style & Naming Conventions

Follow the formatter and linter configured by the project once they exist. Until then, use 2-space indentation for JavaScript, TypeScript, JSON, YAML, and Markdown. Use descriptive file names: `kebab-case` for general files, `PascalCase` for UI components, and `camelCase` for functions and variables. Keep modules focused and avoid broad utility files unless several call sites already need the shared behavior.

## Testing Guidelines

Add tests with any new behavior. Test files should mirror implementation names, such as `src/supplements/parseLabel.ts` and `tests/supplements/parseLabel.test.ts`. Include edge cases for invalid labels, missing fields, duplicate ingredients, and unit normalization. Keep fixtures small and store larger examples under `assets/fixtures/`.

## Commit & Pull Request Guidelines

This repository has no commit history yet, so use concise imperative commit messages, for example `Add supplement label parser`. Pull requests should include a short summary, test results, linked issues when applicable, and screenshots or sample outputs for user-visible changes. Call out schema, dependency, or configuration changes explicitly.

## Security & Configuration Tips

Do not commit API keys, user health data, or private supplement databases. Store local configuration in ignored environment files such as `.env.local`, and provide a sanitized `.env.example` when configuration becomes required.
