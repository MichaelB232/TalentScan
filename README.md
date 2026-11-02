# TalentScan AI

> AI-powered CV screening platform for Recruiters & Talent Acquisition teams.

## Tech Stack

| Layer      | Technology                             |
|------------|----------------------------------------|
| Frontend   | React 18 · TypeScript · Tailwind CSS   |
| Backend    | Express.js · TypeScript                |
| Database   | PostgreSQL via Prisma ORM              |
| AI Engine  | Google Gemini 1.5 Flash                |

---

## Features

- **AI CV Extraction** — Automatically extracts name, DOB (normalized to YYYY-MM-DD), phone (+62 format), skills, experience, education, certifications, and languages from any PDF CV.
- **Language Auto-Detection** — Detects whether the CV is in Bahasa Indonesia or English without user input.
- **Categorized Skill Tagging** — Separates Hard Skills (Python, SQL) from Soft Skills (Leadership, Communication).
- **Format Standardization** — Normalizes dates and phone numbers automatically.
- **JD Matching Score** — AI compares candidate profile against a Job Description and returns a 0–100% match score.
- **Automated Executive Summary** — 2–3 sentence AI-written profile summary per candidate.
- **Skill Gap Analysis** — AI identifies missing skills vs. the target role.
- **Multi-Format Export** — Download extraction as **JSON**, **Excel (XLSX)**, or **PDF Resume**.

---

## Project Structure

```
talentscan-ai/
├── backend/
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── config/          # env, prisma client, gemini client
│   │   ├── types/           # TypeScript interfaces
│   │   ├── errors/          # Custom AppError classes
│   │   ├── repositories/    # Prisma data access layer
│   │   ├── services/        # Business logic + AI calls
│   │   ├── controllers/     # Express HTTP handlers
│   │   ├── routes/          # Express routers
│   │   ├── middlewares/     # multer, global error handler
│   │   ├── utils/           # pdfParser, exportHelpers
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/               # Jest + Supertest integration tests
└── frontend/
    └── src/
        ├── api/             # Axios service calls
        ├── components/      # Reusable UI components
        ├── pages/           # Route-level page components
        └── types/           # Shared TypeScript types
```

---

## Getting Started

### Option A – Docker (recommended)

> Runs PostgreSQL + backend + frontend in three isolated containers from one command.

**Prerequisites:** Docker & Docker Compose v2

```bash
cd talentscan-ai

# 1. Copy and fill in your secrets
cp .env.example .env
#    → set POSTGRES_PASSWORD and GEMINI_API_KEY

# 2. Build images and start all services
docker compose up --build

# 3. Open the app
#    Frontend  →  http://localhost:80   (or FRONTEND_PORT you set)
#    Backend   →  internal only (proxied via Nginx /api)
```

To stop everything:
```bash
docker compose down           # keeps DB volume
docker compose down -v        # also wipes the DB volume
```

To rebuild a single service after a code change:
```bash
docker compose up --build backend
docker compose up --build frontend
```

---

### Option B – Local development (without Docker)

#### Prerequisites

- Node.js >= 18
- PostgreSQL running locally
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

#### Backend

```bash
cd backend
cp .env.example .env        # Fill in DATABASE_URL and GEMINI_API_KEY
npm install
npx prisma migrate dev --name init
npm run dev                  # Starts on http://localhost:5000
```

#### Frontend

```bash
cd frontend
npm install
npm run dev                  # Starts on http://localhost:5173
```

---

## API Reference

| Method | Path                                    | Description                          |
|--------|-----------------------------------------|--------------------------------------|
| POST   | `/api/candidates/upload`                | Upload PDF CV → AI extraction        |
| GET    | `/api/candidates`                       | List all candidates                  |
| GET    | `/api/candidates/:id`                   | Get candidate + extraction           |
| DELETE | `/api/candidates/:id`                   | Delete candidate                     |
| GET    | `/api/candidates/:id/analyses`          | All JD analyses for a candidate      |
| GET    | `/api/candidates/:id/export?format=…`   | Export (json / csv / pdf)            |
| POST   | `/api/job-descriptions`                 | Create a Job Description             |
| GET    | `/api/job-descriptions`                 | List all Job Descriptions            |
| DELETE | `/api/job-descriptions/:id`             | Delete a Job Description             |
| POST   | `/api/analysis`                         | Run JD match analysis                |
| GET    | `/api/analysis/:id`                     | Get a single analysis result         |

---

## Running Tests

```bash
cd backend
npm test
```
