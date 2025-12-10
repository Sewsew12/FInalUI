# Fitness Lifestyle App

A complete fitness tracking and coaching application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **User Registration & Goal Setup**: Multi-step signup with personalized fitness goals
- **Activity Logging**: Log exercises and daily activities with live photo/video capture or wearable device sync
- **Gamification System**: Earn XP, level up, unlock badges, and complete challenges
- **Social Features**: Connect with friends, view leaderboards, and send motivational nudges
- **AI Coach**: Interactive chatbot for personalized fitness coaching and motivation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── api/               # API routes (mock endpoints)
│   ├── activity/          # Activity logging pages
│   ├── dashboard/         # Dashboard page
│   ├── gamification/      # Gamification page
│   ├── leaderboard/       # Leaderboard page
│   ├── friends/           # Friends page
│   ├── coach/             # AI Coach page
│   └── settings/          # Settings page
├── components/             # React components
├── store/                  # Zustand stores
├── lib/                   # Utility functions and mock data
└── public/                # Static assets
```

## Deployment

This app is ready to deploy on Vercel. See `DEPLOYMENT.md` for detailed instructions.

## License

MIT
