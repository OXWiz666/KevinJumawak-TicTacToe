# Grid Club - Tic-Tac-Toe

A polished, responsive two-player Tic-Tac-Toe game built for a little friendly competition. The familiar marks are reimagined as **Spark** and **Orbit**, two custom SVG icons with their own animations.

## Features

- Two players take turns on a 3 x 3 board.
- Detects wins and draws, highlights the winning line, and updates the scoreboard.
- Shows a result popup: the winner and loser are named, while a draw offers a rematch.
- Alternates the starting player after each round.
- Keeps scores between rounds; **Reset match** clears the scores.
- Keyboard controls: press **1-9** to choose a square or **Escape** to start the next round.
- Responsive layout, accessible game controls, and reduced-motion support.

## Tech stack

- Next.js App Router
- React with functional components and hooks
- TypeScript with strict type checking
- Custom CSS and inline SVG icons

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```

## Deploy

Import this repository into [Vercel](https://vercel.com/new). Vercel detects Next.js automatically; use `npm run build` as the build command.

