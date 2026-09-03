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
- **User Accounts** — GitHub OAuth sign-in with persistent preferences stored in PostgreSQL
- **Scheduled Scraping** — GitHub Action re-scrapes regularly; run manually via `scripts/scrape.ts`
- **Polished Theme** — Rose-accented design system with light/dark support via CSS variables

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4, ShadCN (base-mira) |
| Database | PostgreSQL 17 via Prisma 6 |
| Auth | GitHub OAuth + JWT (jose), httpOnly cookies |
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
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"
GITHUB_REDIRECT_URI="http://localhost:3000/api/auth/callback"
```

A GitHub Personal Access Token is recommended for reliable scraping (5,000 req/hr vs 60 unauthenticated).

To enable GitHub OAuth sign-in, create a GitHub OAuth App at developer settings and set the callback URL to match `GITHUB_REDIRECT_URI`.

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

The project is organized as a Next.js 16 App Router application:

- **`app/`** — pages and API routes. Pages include the landing page, onboarding, results, privacy policy, and terms. API routes under `app/api/` handle auth (GitHub OAuth, session, signout), recommendations, scraping, and user preferences.
- **`components/`** — React components grouped by feature: landing, auth (GitHub sign-in modal), onboarding flow, recommendations, account menu, theme, and shared UI primitives.
- **`lib/`** — server and client utilities: Prisma client, GitHub API client, Bright Data integration, scraper pipeline, README analyzer, matching logic, session/JWT handling, auth context, types, and validation.
- **`prisma/`** — database schema and migrations.
- **`scripts/`** — the scraper pipeline runner.
- **`proxy.ts`** — Next.js 16 middleware for auth protection and rate limiting.
- **`.github/workflows/`** — scheduled scraper.

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/auth/github` | No | Redirect to GitHub OAuth authorize |
| GET | `/api/auth/callback` | No | GitHub OAuth callback (exchanges code, sets session) |
| POST | `/api/auth/signout` | No | Sign out |
| GET | `/api/auth/session` | No | Get current session |
| GET | `/api/recommendations` | Yes | Get issue recommendations with README intelligence |
| GET | `/api/scrape/status` | Yes | Scrape stats (repos, open issues, readmes, last scrape time) |
| GET | `/api/scrape` | Yes | Trigger the full scrape pipeline |
| GET | `/api/user/preferences` | Yes | Get user preferences |
| PUT | `/api/user/preferences` | Yes | Update user preferences |

## Rate Limiting

All API endpoints are rate limited to **100 requests per minute per IP address**. When the limit is exceeded, the API returns a `429 Too Many Requests` response. The `X-RateLimit-Remaining` header indicates remaining requests in the current window.

## Database Schema

The database is PostgreSQL managed via Prisma. It stores:

- **`User`** — id, unique email, name, GitHub avatar URL, unique GitHub ID, and creation time, related to preferences and consents.
- **`UserPreferences`** — one-to-one with a user; stores interests, experience level, goals, languages, and custom languages (as JSON arrays).
- **`ScrapedRepo`** — scraped GitHub repositories with metadata (stars, forks, language, topics, license) and related issues and README.
- **`ScrapedIssue`** — issues scraped per repo (number, title, URL, labels, state, comments, author).
- **`ScrapedReadme`** — one-to-one README content per repo with computed intelligence (contribution guide, setup complexity, tech stack, architecture keywords).
- **`UserConsent`** — records user consent (type, granted, IP address, timestamp), unique per user and consent type.

## Scraping

The pipeline (Bright Data discovery → GitHub repo/issue/README scraping → analysis) can be run three ways:

```bash
npm run scrape    # runs npx tsx --env-file=.env scripts/scrape.ts
```

- `GET /api/scrape` triggers the full pipeline.
- `.github/workflows/scrape.yml` runs the pipeline automatically regularly.

## Docker Management

```bash
docker compose up -d     # start the database
docker compose stop      # stop the database
docker compose down -v   # remove container and volume
```

If you used the standalone `docker run` command instead, manage it with `docker start/stop/rm scrapeverse-db`.
