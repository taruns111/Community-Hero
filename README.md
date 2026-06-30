# CivicAI – Community Hero

AI-powered civic engagement platform that helps citizens report local infrastructure issues and helps governments resolve them faster.

**APP**
🔗 Link :- https://community-hero-git-main-tarun-saini-s-projects.vercel.app/

## Overview

CivicAI lets citizens report problems like potholes, garbage overflow, water leakage, broken street lights, and similar civic issues by simply uploading a photo. Google Gemini's vision model analyzes the image to classify the issue, assess severity, and recommend the responsible department — removing the friction of manual reporting. Citizens can track reports on a live map, verify nearby issues, and climb a community leaderboard, while government users get an analytics dashboard to prioritize and resolve issues.

## Features

- **AI-Powered Issue Analysis** – Google Gemini Vision auto-categorizes uploaded photos, assigns severity (Low/Medium/High/Critical), and suggests the responsible department.
- **Interactive Geo-Mapping** – Issues are pinned on an OpenStreetMap-based map (Leaflet) with color-coded status markers.
- **Community Verification** – Nearby citizens confirm or reject reports; verified issues are auto-escalated to authorities.
- **Fake Report Detection** – AI-generated authenticity score flags spam, edited images, and mismatched locations.
- **Citizen & Government Dashboards** – Role-based dashboards for tracking personal reports or managing all civic issues.
- **Leaderboard & Gamification** – Ranks active citizens by verified, high-impact reports.
- **AI Chat Assistant** – In-app Gemini-powered chat widget for user help.
- **Authentication** – Firebase-based login/registration for citizens and admins.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| AI / ML | Google Gemini API (`@google/generative-ai`) |
| Maps | Leaflet, React-Leaflet (OpenStreetMap) |
| Backend / Auth / DB | Firebase |
| Charts | Recharts |
| UI Utilities | Lucide React, React Icons, React Dropzone, React Hot Toast |

## Project Structure

```
app/
  page.tsx                 # Landing page
  report/                  # Issue reporting flow (AI photo analysis)
  issues/                  # Browse/filter all reported issues
  map/                     # Map view of all issues
  dashboard/citizen/        # Citizen dashboard
  dashboard/government/     # Government/admin dashboard
  dashboard/analytics/      # Analytics & charts
  leaderboard/              # Community leaderboard
  auth/login, auth/register # Authentication pages
  admin/                     # Admin panel
  api/
    analyze-issue/           # Gemini image analysis endpoint
    detect-fake/              # Fake-report detection endpoint
    chat/                      # AI chat assistant endpoint
components/
  chat/      # Chat widget
  layout/    # Navbar, Footer
  map/       # Map & location picker components
lib/
  gemini.ts    # Gemini API client
  firebase.ts  # Firebase config
  mockData.ts  # Sample/demo data
  store.tsx    # Global state
```

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key
- A Firebase project (for auth/database)

### Installation

```bash
git clone https://github.com/taruns111/Community-Hero.git
cd Community-Hero
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

Required variables include your Gemini API key and Firebase project configuration (see `.env.example` for the full list).

### Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## How It Works

1. A citizen uploads a photo of a civic issue through the **Report** page.
2. The image is sent to the `/api/analyze-issue` endpoint, which calls Gemini to classify the issue, determine severity, and suggest the responsible department.
3. The report is published and pinned on the interactive map.
4. Nearby citizens can verify the report; once enough verifications are gathered, the issue is escalated to the government dashboard.
5. Government users track, prioritize, and resolve issues, with all activity reflected in the analytics dashboard and citizen leaderboard.

## License

This project was built for a hackathon. Add a license of your choice here.
