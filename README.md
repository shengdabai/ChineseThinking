# 🧠 ChineseThinking · 中文思维

> **Learn to *think* in Chinese — not just translate word for word.**
> An AI Chinese-learning platform built on daily micro-challenges and a judgment-free AI conversation partner.

**English | [中文](#中文)**

[![Last commit](https://img.shields.io/github/last-commit/shengdabai/ChineseThinking)](https://github.com/shengdabai/ChineseThinking/commits)
[![Stars](https://img.shields.io/github/stars/shengdabai/ChineseThinking?style=social)](https://github.com/shengdabai/ChineseThinking/stargazers)
[![Follow @shengdabai](https://img.shields.io/github/followers/shengdabai?style=social)](https://github.com/shengdabai)

---

## Why ChineseThinking?

Most apps teach you to translate from your native language one word at a time. That habit is exactly what keeps learners stuck — the sentences come out grammatically "correct" but sound nothing like how a native speaker actually thinks.

**ChineseThinking flips the model.** Instead of drilling vocabulary, it trains the *thought structures* behind real Chinese. Every reply you get from the AI breaks the language down into a **thought map**: the Chinese sentence, its pinyin, the literal meaning, and the natural English — so you can see *why* a phrase is built the way it is, then internalize the pattern.

It is built by a Chinese-language teacher with 6,000+ students, in public.

## What it does

- **Think in patterns, not translations** — learn the thought structures of Chinese, not mechanical word-for-word swaps.
- **Daily micro-challenges** — bite-sized prompts calibrated to your level, low enough effort to fit between scrolls of social media.
- **A judgment-free AI partner** — converse 24/7 with an AI that encourages expression and never punishes mistakes.

## ✨ Features

- **🗺️ Thought-map breakdowns** — every AI response shows `chinese · pinyin · literal · natural English`, so meaning and structure are always visible.
- **🎯 Level-aware daily challenges** — beginner / intermediate / advanced, with display rules that progressively hide pinyin and translations as you grow (A: pinyin + English, B: mixed hanzi, C: hanzi only).
- **💬 AI conversation partner** — scenario-based chat that surfaces new expressions you can reuse.
- **📓 Mistake review** — captured corrections you can revisit, with review tracking.
- **📊 Dashboard & streaks** — track daily practice and keep momentum.
- **🚀 Guided onboarding** — sets your level, interests, and practice rhythm.
- **🔊 Text-to-speech** — browser-native pronunciation practice.
- **🔐 Freemium gating** — usage-based rate limiting and paywall.
- **📱 PWA-ready** — installable as a mobile web app.

## 🧱 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | OpenAI SDK |
| Database / Auth | Supabase |
| Runtime & package manager | Bun |
| Speech | Browser-native Web Speech (TTS) |

## 🚀 Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Configure environment (see below)
cp .env.local.example .env.local

# 3. Run the dev server
bun run dev
```

Open <http://localhost:3000>.

Other scripts:

```bash
bun run build   # production build
bun run start   # start production server
bun run lint    # run eslint
```

### Environment variables

Create `.env.local` (a template lives in `.env.local.example`):

```
OPENAI_API_KEY=your-key-here
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📖 Usage

1. **Onboard** — pick your level and interests.
2. **Take the daily challenge** — respond to a short prompt; the AI gives feedback, a better version, and a thought map.
3. **Chat with the AI partner** — practice freely; expand new expressions as they appear.
4. **Review mistakes** — revisit corrections so they stick.
5. **Watch your streak grow** on the dashboard.

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

Private repository. All rights reserved.

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
| 框架 | Next.js 16(App Router) |
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

私有仓库,保留所有权利。
