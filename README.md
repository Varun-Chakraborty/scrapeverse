# Open Source Opportunity Finder

Discover open-source projects that match your interests, skill level, and contribution goals. Get personalized recommendations in under 30 seconds.

## Features

- **Marketing Landing Page** — hero, features, how-it-works, testimonials, and FAQ with scroll reveal animations
- **Smart Onboarding** — 4-step flow to capture your interests, experience, goals, and languages
- **Personalized Recommendations** — Filtered issue cards with repo details, difficulty levels, and contributor-friendly labels
- **Explainability** — Every recommendation explains why it was suggested
- **README Intelligence** — Contribution guide detection, setup complexity, tech stack, and architecture analysis
- **Filters** — Difficulty and language filters with a friendly empty state
- **Direct GitHub Links** — Every card links to the live issue and its repository
- **User Accounts** — Sign up / sign in with persistent preferences stored in PostgreSQL
- **Scheduled Scraping** — GitHub Action re-scrapes every 6 hours; run manually via `scripts/scrape.ts`
- **Polished Theme** — Rose-accented design system with light/dark support via CSS variables

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4, ShadCN (base-mira) |
| Database | PostgreSQL 17 via Prisma 6 |
| Auth | JWT (jose) + bcryptjs, httpOnly cookies |
| Data Sources | GitHub API (details, issues, READMEs), Bright Data (trending discovery) |
| Proxy | Next.js 16 `proxy.ts` (middleware replacement) |

## Getting Started

### Prerequisites

- Node.js 24+
- Docker (for PostgreSQL) or a running PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This uses the bundled `docker-compose.yml` (container `scrapeverse-db`, database `osof`). Alternatively, run a standalone instance:

```bash
docker run -d --name scrapeverse-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=osof \
  -p 5432:5432 \
  postgres:17-alpine
```

Or use an existing PostgreSQL instance and update `.env`.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL, session secret, and API keys:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/osof?schema=public"
SESSION_SECRET="your-random-secret-here"
BRIGHTDATA_API_KEY="your-brightdata-api-key"
GITHUB_TOKEN="your-github-personal-access-token"
```

A GitHub Personal Access Token is recommended for reliable scraping (5,000 req/hr vs 60 unauthenticated).

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── .github/
│   └── workflows/
│       └── scrape.yml     # Scheduled scraper (every 6 hours)
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── change-password/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   ├── session/route.ts
│   │   │   ├── signin/route.ts
│   │   │   ├── signout/route.ts
│   │   │   └── signup/route.ts
│   │   ├── recommendations/route.ts
│   │   ├── scrape/
│   │   │   ├── route.ts
│   │   │   └── status/route.ts
│   │   └── user/
│   │       └── preferences/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── onboarding/page.tsx
│   └── page.tsx
├── components/
│   ├── account/
│   │   └── user-menu.tsx
│   ├── auth/
│   │   └── auth-modal.tsx
│   ├── landing/
│   │   ├── cta.tsx
│   │   ├── faq.tsx
│   │   ├── features.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── how-it-works.tsx
│   │   ├── landing-page.tsx
│   │   ├── logo.tsx
│   │   ├── navbar.tsx
│   │   └── testimonials.tsx
│   ├── onboarding/
│   │   ├── onboarding-flow.tsx
│   │   ├── progress-bar.tsx
│   │   ├── step-experience.tsx
│   │   ├── step-goals.tsx
│   │   ├── step-interests.tsx
│   │   └── step-languages.tsx
│   ├── recommendations/
│   │   ├── empty-state.tsx
│   │   ├── filter-sidebar.tsx
│   │   ├── recommendation-card.tsx
│   │   ├── recommendation-grid.tsx
│   │   └── results-page.tsx
│   └── ui/              # ShadCN components + reveal/select primitives
├── lib/
│   ├── auth-context.tsx
│   ├── brightdata.ts
│   ├── db.ts
│   ├── github-api.ts
│   ├── mock-data.ts
│   ├── readme-analyzer.ts
│   ├── scraper-pipeline.ts
│   ├── session.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/
│   └── scrape.ts        # Manual pipeline runner
├── proxy.ts             # Next.js 16 middleware (auth protection)
├── docker-compose.yml
└── .env.example
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/signin` | No | Sign in |
| POST | `/api/auth/signout` | No | Sign out |
| GET | `/api/auth/session` | No | Get current session |
| POST | `/api/auth/change-password` | Yes | Change password (verifies current password) |
| POST | `/api/auth/reset-password` | No | Reset password with email + new password (no verification) |
| GET | `/api/recommendations` | Yes | Get issue recommendations with README intelligence |
| GET | `/api/scrape/status` | Yes | Scrape stats (repos, open issues, readmes, last scrape time) |
| GET | `/api/scrape` | Yes | Trigger full pipeline; `?repo=owner/name` scrapes a single repo |
| GET | `/api/user/preferences` | Yes | Get user preferences |
| PUT | `/api/user/preferences` | Yes | Update user preferences |

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String              // bcrypt hashed
  createdAt DateTime @default(now())
  preferences UserPreferences?
}

model UserPreferences {
  id              String   @id @default(cuid())
  userId          String   @unique
  interests       String   @default("[]")   // JSON array
  experienceLevel String?
  goals           String   @default("[]")   // JSON array
  languages       String   @default("[]")   // JSON array
  customLanguages String   @default("[]")   // JSON array
  updatedAt       DateTime @updatedAt
}

model ScrapedRepo {
  id            Int      @id
  fullName      String   @unique
  owner         String
  name          String
  description   String?
  language      String?
  stars         Int      @default(0)
  forks         Int      @default(0)
  topics        String   @default("[]")   // JSON array
  license       String?
  defaultBranch String?
  pushedAt      DateTime?
  scrapedAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  issues        ScrapedIssue[]
  readme        ScrapedReadme?
}

model ScrapedIssue {
  id        Int      @id @default(autoincrement())
  repoId    Int
  repo      ScrapedRepo @relation(fields: [repoId], references: [id], onDelete: Cascade)
  number    Int
  title     String
  url       String
  labels    String   @default("[]")   // JSON array
  state     String   @default("open")
  comments  Int      @default(0)
  author    String?
  createdAt DateTime?
  scrapedAt DateTime @default(now())
  @@unique([repoId, number])
}

model ScrapedReadme {
  id                   Int      @id @default(autoincrement())
  repoId               Int      @unique
  repo                 ScrapedRepo @relation(fields: [repoId], references: [id], onDelete: Cascade)
  rawContent           String
  hasContributionGuide Boolean  @default(false)
  setupComplexity      String   @default("unknown")
  techStack            String   @default("[]")   // JSON array
  architectureKeywords String   @default("[]")   // JSON array
  scrapedAt            DateTime @default(now())
}
```

## Scraping

The pipeline (Bright Data discovery → GitHub repo/issue/README scraping → analysis) can be run three ways:

```bash
npm run scrape    # runs npx tsx --env-file=.env scripts/scrape.ts
```

- `GET /api/scrape` triggers the full pipeline; `GET /api/scrape?repo=owner/name` scrapes a single repository.
- `.github/workflows/scrape.yml` runs the pipeline automatically every 6 hours.

## Docker Management

```bash
docker compose up -d     # start the database
docker compose stop      # stop the database
docker compose down -v   # remove container and volume
```

If you used the standalone `docker run` command instead, manage it with `docker start/stop/rm scrapeverse-db`.
