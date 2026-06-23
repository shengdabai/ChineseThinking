@AGENTS.md

# ChineseThinking - 中文思维学习平台

## Project Overview
AI-powered Chinese learning platform that teaches Chinese thinking patterns, not just translation.
Core: AI conversation partner + daily micro-challenges.

## Tech Stack
- Next.js 15/16-canary (App Router, TypeScript, Tailwind CSS)
- Bun as package manager and runtime
- PWA-ready web app

## Commands
```bash
bun install          # install dependencies
bun run dev          # start dev server
bun run build        # production build
bun run lint         # run eslint
```

## Architecture
```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing page
│   ├── chat/         # AI conversation partner
│   ├── challenge/    # Daily micro-challenges
│   └── api/          # API routes
├── components/       # Shared UI components
├── lib/              # Utilities, AI client, types
└── content/          # Challenge scenarios, prompts
```

## Design Doc
Product design document lives in the local gstack project directory (machine-local path, not committed).

## Key Principles
- Encourage expression, never punish errors
- Chinese thinking patterns, not mechanical translation
- Keep practice threshold as low as scrolling social media
- MVP: English UI only, text-first (voice in Phase 2)

## gstack
Use /browse from gstack for all web browsing. Never use mcp__claude-in-chrome__* tools.
Available skills: /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /design-review, /review, /ship, /browse, /qa, /qa-only,
/setup-browser-cookies, /retro, /document-release, /gstack-upgrade.
