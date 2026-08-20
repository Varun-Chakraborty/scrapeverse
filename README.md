# Open Source Opportunity Finder

Discover open-source projects that match your interests, skill level, and contribution goals. Get personalized recommendations in under 30 seconds.

## Features

- **Smart Onboarding** — 5-step flow to capture your interests, experience, goals, languages, and time commitment
- **Personalized Recommendations** — Filtered project cards with stars, activity level, beginner issues, and maintainer response times
- **Explainability** — Every recommendation explains why it was suggested
- **Filters** — Min stars, difficulty, language, activity level, beginner-friendly, systems projects
- **User Accounts** — Sign up / sign in with persistent preferences stored in PostgreSQL
- **Preferences Editor** — Update your profile anytime from the results page
- **Dark Mode First** — Premium developer-tool aesthetic

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4, ShadCN (base-mira) |
| Database | PostgreSQL 18 via Prisma 7 |
| Auth | JWT (jose) + bcryptjs, httpOnly cookies |
| Proxy | Next.js 16 `proxy.ts` (middleware replacement) |

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL) or a running PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker run -d --name osof-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=osof \
  -p 5432:5432 \
  postgres:18
```

Or use an existing PostgreSQL instance and update `.env`.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL and a session secret:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/osof?schema=public"
SESSION_SECRET="your-random-secret-here"
```

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
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── signin/route.ts
│   │   │   ├── signout/route.ts
│   │   │   └── session/route.ts
│   │   └── user/
│   │       └── preferences/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── account/
│   │   ├── preferences-editor.tsx
│   │   └── user-menu.tsx
│   ├── auth/
│   │   └── auth-modal.tsx
│   ├── landing/
│   │   └── hero.tsx
│   ├── onboarding/
│   │   ├── onboarding-flow.tsx
│   │   ├── progress-bar.tsx
│   │   ├── step-experience.tsx
│   │   ├── step-goals.tsx
│   │   ├── step-interests.tsx
│   │   ├── step-languages.tsx
│   │   └── step-time.tsx
│   ├── recommendations/
│   │   ├── empty-state.tsx
│   │   ├── filter-sidebar.tsx
│   │   ├── recommendation-card.tsx
│   │   ├── recommendation-grid.tsx
│   │   └── results-page.tsx
│   └── ui/              # ShadCN components
├── lib/
│   ├── auth-context.tsx
│   ├── db.ts
│   ├── mock-data.ts
│   ├── session.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── proxy.ts             # Next.js 16 middleware (auth protection)
└── .env.example
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/signin` | No | Sign in |
| POST | `/api/auth/signout` | No | Sign out |
| GET | `/api/auth/session` | No | Get current session |
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
  timeCommitment  String?
  updatedAt       DateTime @updatedAt
}
```

## Docker Management

```bash
docker start osof-postgres   # start the database
docker stop osof-postgres    # stop the database
docker rm osof-postgres      # remove the container
```
