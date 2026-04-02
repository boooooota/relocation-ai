# Relocation AI

Your AI-powered move planner — generates cost estimates and move 
timelines from a single conversation.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E)
![OpenAI](https://img.shields.io/badge/OpenAI-tool%20calls-412991)
![Vercel](https://img.shields.io/badge/deployed-Vercel-000)

## Demo

🔗 [relocation-ai.com](https://relocation-ai.com)

![App screenshot](./docs/screenshot.png)

## Features

- **Streaming AI chat** — responses stream token by token via the Vercel AI SDK
- **Cost estimate tool** — structured breakdown of housing, shipping, visa, and living costs
- **Move timeline generator** — milestone plan with dates, categories, and dependencies
- **Persistent conversations** — chat history saved per user via Supabase
- **Google OAuth** — one-click sign-in, server-side session management

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database + Auth | Supabase |
| AI | OpenAI API + Vercel AI SDK |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |
| Testing | Vitest |

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project ([create one free](https://supabase.com))
- An OpenAI API key ([platform.openai.com](https://platform.openai.com))

### Installation

1. Clone the repo
```bash
   git clone https://github.com/boooooota/relocation-ai.git
   cd relocation-ai
```

2. Install dependencies
```bash
   npm install
```

3. Set up environment variables
```bash
   cp .env.example .env.local
```
   Then fill in the values in `.env.local` — see the table below.

4. Run the development server
```bash
   npm run dev
```

Open [http://localhost:3000](http://localhost:3000).


## Environment Variables

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |

A full `.env.example` is included in the repo root.

## Architecture
 
Next.js App Router handles both the frontend and API layer. The `/api/chat` route runs on the Edge runtime and streams OpenAI responses back to the client using the Vercel AI SDK. Tool calls (cost estimate, timeline) are defined server-side and their structured output is persisted to Supabase on completion alongside the conversation history. Supabase handles both authentication (Google OAuth via server-side session cookies) and the database (users, conversations, messages tables with row-level security policies).
 
## Roadmap
 
- [ ] Multi-destination comparison — side-by-side cost estimates for 2+ cities
- [ ] PDF export — downloadable cost summary and timeline for offline sharing
- [ ] Real cost data — replace model estimates with live housing/visa API sources