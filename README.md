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

## 🧱 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15/16-canary (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | OpenAI SDK |
| Database / Auth | Supabase |
| Runtime & package manager | Bun |
| Speech | Browser-native Web Speech (TTS) |

## 🚀 Quick Start

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

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing
│   ├── onboarding/   # Level + interest setup
│   ├── chat/         # AI conversation partner
│   ├── challenge/    # Daily micro-challenges
│   ├── mistakes/     # Mistake review
│   ├── dashboard/    # Streaks & progress
│   ├── learn/        # Learning content
│   └── api/          # chat, challenge endpoints
├── components/       # ChatBubble, Navigation, Paywall, ShareCard, TTS
├── lib/              # AI client, prompts, types, storage, rate-limit, entitlement
└── content/          # Challenge scenarios + phrase data
```

## 🗺️ Status

Active MVP, built in public. Current scope is English-UI, text-first; voice input and richer content are on the roadmap. Expect rapid iteration.

## 🤝 Connect & About

Built by **Tony (Sheng)** — a Chinese-language teacher with 6,000+ students, building AI + Chinese-teaching tools in the open.

If this resonates, the best way to support it is to **⭐ Star this repo and [Follow @shengdabai](https://github.com/shengdabai)** — it genuinely helps and tells me what to build next.

Sibling projects worth a look:

- **chinese-mission** — gamified Chinese learning missions.
- **LinguaLens** — language understanding through a different lens.
- **hsk-prep-platform** — structured HSK exam preparation.

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

<a name="中文"></a>

# 🧠 ChineseThinking · 中文思维

> **学会用中文「思考」，而不只是逐字翻译。**
> 一个以「每日微挑战」和「零评判 AI 对话伙伴」为核心的 AI 中文学习平台。

**[English](#-chinesethinking--中文思维) | 中文**

## 为什么是 ChineseThinking？

大多数 App 教你的是「把母语一个词一个词地翻成中文」——而这恰恰是学习者卡住的根源：句子语法上「对」，但完全不像母语者真正的表达方式。

**ChineseThinking 反其道而行。** 它训练的不是死记单词，而是中文背后的**思维结构**。AI 的每一条回复都会拆成一张**思维地图**:中文句子、拼音、字面意思、地道英文——让你看清一句话*为什么*这样组织，然后把这个模式内化下来。

由一位拥有 6000+ 学员的中文老师公开打造。

## 它能做什么

- **学模式，不学翻译** —— 掌握中文的思维结构，而非机械的逐字替换。
- **每日微挑战** —— 按水平定制的小任务，门槛低到像刷社交媒体一样轻松。
- **零评判的 AI 伙伴** —— 24/7 随时对话,只鼓励表达,绝不惩罚错误。

## ✨ 功能特性

- **🗺️ 思维地图拆解** —— 每条 AI 回复都展示 `中文 · 拼音 · 字面 · 地道英文`,意思与结构一目了然。
- **🎯 分级每日挑战** —— 初级 / 中级 / 高级，随水平提升逐步隐藏拼音与翻译(A:拼音+英文,B:汉字混排,C:纯汉字)。
- **💬 AI 对话伙伴** —— 场景化对话,主动提示可复用的新表达。
- **📓 错题复习** —— 收录纠正记录,可反复回顾并追踪复习次数。
- **📊 仪表盘与连胜** —— 记录每日练习,保持动力。
- **🚀 引导式上手** —— 设置你的水平、兴趣与练习节奏。
- **🔊 语音朗读** —— 浏览器原生 TTS,练习发音。
- **🔐 免费增值** —— 基于用量的限流与付费墙。
- **📱 PWA** —— 可安装为移动端 Web App。

## 🧱 技术栈

| 层 | 选型 |
|------|------|
| 框架 | Next.js 15/16-canary(App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| AI | OpenAI SDK |
| 数据库 / 认证 | Supabase |
| 运行时与包管理 | Bun |
| 语音 | 浏览器原生 Web Speech(TTS) |

## 🚀 快速开始

```bash
bun install                    # 安装依赖
cp .env.local.example .env.local   # 配置环境变量
bun run dev                    # 启动开发服务器
```

打开 <http://localhost:3000>。

环境变量(模板见 `.env.local.example`):

```
OPENAI_API_KEY=你的-key
NEXT_PUBLIC_SUPABASE_URL=你的-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的-anon-key
```

## 📖 使用流程

1. **上手引导** —— 选择水平与兴趣。
2. **完成每日挑战** —— 回应简短提示,AI 给出反馈、更好的版本和思维地图。
3. **与 AI 伙伴对话** —— 自由练习,展开新出现的表达。
4. **复习错题** —— 让纠正真正记住。
5. 在**仪表盘**上看着连胜增长。

## 🗺️ 项目状态

公开打造中的活跃 MVP。当前范围为英文界面、文本优先;语音输入与更丰富的内容在路线图上。迭代频繁。

## 🤝 联系与关于

由 **Tony(Sheng)** 打造 —— 一位拥有 6000+ 学员的中文老师,公开构建 AI + 中文教学工具。

如果这个项目打动了你,最好的支持就是 **⭐ Star 本仓库并[关注 @shengdabai](https://github.com/shengdabai)** —— 这对我很有帮助,也会告诉我接下来该做什么。

姊妹项目:

- **chinese-mission** —— 游戏化的中文学习任务。
- **LinguaLens** —— 从另一个视角理解语言。
- **hsk-prep-platform** —— 系统化的 HSK 备考平台。

## 许可

MIT 开源协议，详见 [LICENSE](./LICENSE)。
