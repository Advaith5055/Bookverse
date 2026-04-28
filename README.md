# BookVerse

BookVerse is a modern reading community web app for discovering books, sharing recommendations, joining discussions, and listing books for sale, swap, sharing, or borrowing.

The app is built with React, TypeScript, Vite, Tailwind CSS, shadcn-ui, and Supabase.

## Features

- Book discovery pages with search, genre filters, ratings, reader counts, and "Book DNA" style recommendation visuals
- Marketplace for browsing books by listing type, genre, language, condition, and price
- Book detail pages with descriptions, metadata, reviews, and community actions
- Add-book flow with book information, listing type, image upload UI, safety tips, and preview
- Community feed for posts tied to books, with likes, comments, bookmarks, reactions, and trending sections
- User authentication and profiles powered by Supabase
- Follow/unfollow support with follower and following counts
- Reader profile stats such as books read, books added, reading goals, swaps, and reviews
- Discover page for finding readers and community activity
- Chat-style recommendation assistant for book suggestions and reading prompts
- Animated page transitions and responsive navigation

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- Radix UI
- Framer Motion
- React Router
- TanStack Query
- Supabase
- ESLint

## Project Structure

```text
.
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Shared UI and app components
│   ├── components/ui/      # shadcn-ui component library
│   ├── contexts/           # Auth context
│   ├── hooks/              # Reusable React hooks
│   ├── integrations/       # Supabase client and generated types
│   ├── lib/                # Utility helpers
│   ├── pages/              # App routes and screens
│   ├── App.tsx             # Routes and providers
│   └── main.tsx            # App entry point
├── supabase/
│   ├── config.toml
│   └── migrations/         # Database schema and RLS policies
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Landing and feature-rich home page |
| `/auth` | Sign in and sign up |
| `/books` | Browse and discover books |
| `/marketplace` | Find books to buy, swap, borrow, or share |
| `/book/:id` | View book details, reviews, and actions |
| `/community` | Community posts and discussions |
| `/discover` | Discover readers and community activity |
| `/profile` | User profile, stats, goals, and activity |
| `/chat` | Book recommendation chat experience |
| `/add-book` | Create a new book listing |
| `/post/:id` | View a community post and comments |

## Database

The Supabase migrations define:

- `profiles` for user profile data, reading goals, stats, and follow counts
- `posts` for community book posts
- `post_likes` for liking posts
- `comments` for post discussions
- `follows` for following and unfollowing readers

Row Level Security policies are included for public reads and authenticated user writes.

## Getting Started

### Prerequisites

- Node.js
- npm
- A Supabase project

### Installation

Clone the repository:

```bash
git clone https://github.com/Advaith5055/Bookverse.git
cd Bookverse
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Supabase Setup

1. Create a Supabase project.
2. Add the environment variables listed above to `.env`.
3. Apply the SQL migrations from `supabase/migrations`.
4. Enable email authentication or the auth providers you want to support.
5. Start the app with `npm run dev`.

## Notes

- `node_modules`, `.env`, logs, and build output are intentionally excluded from Git.
- The Supabase client reads configuration from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Some book data and recommendation responses are currently mocked in the frontend and can be connected to live APIs later.

## Author

Built by [Advaith5055](https://github.com/Advaith5055).
