# ChineseThinking

AI Chinese learning platform that teaches thinking patterns, not just translation — daily micro-challenges + AI partner. 中文思维学习平台

## Business Context

- **Category:** education product
- **Audience:** learners, teachers, parents, and education operators who need a clearer learning or exam-prep workflow.
- **Repository status:** Public repository. Keep examples, docs, and issues free of credentials, private data, and machine-specific paths.
- **Topics:** ai, chinese-learning, language-learning, nextjs, openai, thinking, typescript

## What This Project Is For

- AI Chinese learning platform that teaches thinking patterns, not just translation — daily micro-challenges + AI partner. 中文思维学习平台.
- Give users a concrete learning workflow instead of a loose collection of content.
- Make practice, feedback, review, or recommendation steps easier to repeat.

## Where It Fits

This repository supports productized learning workflows: diagnostic input, guided practice, review loops, and clearer handoff between learner, teacher, and software.

## Technical Overview

- **Primary language:** TypeScript
- **Detected stack:** TypeScript, Node.js, Next.js, React, Tailwind CSS, Supabase
- **Default branch:** `main`
- **Visibility:** `PUBLIC`
- **License:** MIT License

## Repository Map

- `src`
- `public`
- `.claude`
- `.env.local.example`
- `AGENTS.md`
- `CLAUDE.md`
- `LICENSE`
- `README.md`
- `SECURITY.md`
- `bun.lock`
- `eslint.config.mjs`
- `next.config.ts`

## Quick Start

Use the commands that match the current project state:

```bash
bun install
bun run dev
bun start
bun run build
bun run lint
```

| Command | Purpose |
|---|---|
| `bun install` | Install project dependencies. |
| `bun run dev` | bun run browse/src/cli.ts |
| `bun start` | bun run browse/src/server.ts |
| `bun run build` | bun run gen:skill-docs && bun run gen:skill-docs --host codex && bun build --compile browse/src/cli.ts --ou... |
| `bun run lint` | eslint |
| `bun run test` | bun test browse/test/ test/ --ignore 'test/skill-e2e-*.test.ts' --ignore test/skill-llm-eval.test.ts --igno... |

## Operating Notes

- Keep real credentials out of the repository. Use local environment files, GitHub repository secrets, or the deployment platform secret manager.
- If a `.env.example` file exists, treat it as documentation only; never commit filled-in `.env` files.
- Before publishing screenshots, demos, or client examples, remove private names, internal paths, account IDs, and API endpoints.
- The `Repository Hygiene` workflow is a lightweight guardrail, not a replacement for product-specific tests.

## Delivery Checklist

- [ ] README describes the user, business outcome, and operating boundary.
- [ ] Setup or preview commands are current and do not rely on private machine state.
- [ ] No real secrets, private user data, or machine-local state are tracked.
- [ ] Screenshots, demos, or sample outputs are safe to share publicly when the repository is public.
- [ ] Product-specific tests or smoke checks are documented before production use.

## Roadmap

- Tighten the fastest path from clone to useful demo.
- Add project-specific screenshots, sample outputs, or a short walkthrough where useful.
- Promote repeated manual steps into scripts, tests, or documented workflows.
- Keep security, privacy, and licensing boundaries explicit as the project evolves.

## Maintainer Notes

Maintained by [Tony Sheng](https://github.com/shengdabai). This README is written as a business-facing handoff: it should help a future collaborator, client, or reviewer understand why the repository exists, how to inspect it, and what must be true before it is reused or shipped.
