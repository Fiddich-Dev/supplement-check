# Repository Guidelines

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
