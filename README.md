# ChineseThinking

AI-powered Chinese learning platform that teaches Chinese thinking patterns, not just translation. Practice with an AI conversation partner and daily micro-challenges.

中文思维学习平台 -- 通过 AI 对话伙伴和每日微挑战，教你用中文思考，而不只是翻译。

## Features / 功能特性

- **AI Chat Partner** -- Conversation practice with thought map breakdowns (literal vs. natural meaning)
- **Daily Challenges** -- Micro-challenges calibrated to beginner / intermediate / advanced levels
- **Thinking Patterns** -- Learn Chinese thought structures, not mechanical word-for-word translation
- **TTS Support** -- Text-to-speech for pronunciation practice
- **Rate Limiting & Paywall** -- Freemium model with usage-based gating
- **PWA Ready** -- Installable as a mobile web app

## Tech Stack / 技术栈

- **Framework**: Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **AI**: OpenAI SDK
- **Database**: Supabase
- **Runtime**: Bun
- **TTS**: Browser-native speech synthesis

## Project Structure / 项目结构

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing page
│   ├── chat/         # AI conversation partner
│   ├── challenge/    # Daily micro-challenges
│   └── api/          # API routes
├── components/       # Shared UI components
│   ├── ChatBubble    # Chat message display
│   ├── Navigation    # App navigation
│   ├── Paywall       # Freemium gate
│   ├── ShareCard     # Social sharing
│   └── TTS           # Text-to-speech control
├── lib/              # AI client, types, storage, entitlements
└── content/          # Challenge scenarios, phrase data
```

## Getting Started / 快速开始

```bash
bun install
bun run dev
```

Open http://localhost:3000

## Configuration / 配置

Create `.env.local` with:
```
OPENAI_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Design Principles / 设计理念

- Encourage expression, never punish errors
- Chinese thinking patterns over mechanical translation
- Keep practice threshold as low as scrolling social media

## License

Private repository. All rights reserved.
