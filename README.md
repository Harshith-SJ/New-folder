# Free Drawing Whiteboard (Solo Instructor)

Modern whiteboard for solo teaching, sketching, and screen-sharing.

## Features in this milestone

- Full-screen whiteboard canvas using `tldraw`
- Session title + timer with local persistence
- Snapshot export/import for session metadata (title + timer state)
- Intentional in-canvas shape snapping (hold `Shift` while drawing)
- Shape snapping targets: rectangle, circle, and arrow
- Normal handwriting/drawing remains raw when `Shift` is not pressed

## Tech stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- Whiteboard: tldraw

## Project structure

- `apps/web` — UI and whiteboard experience

## Setup (Windows)

Follow [docs/setup-windows.md](docs/setup-windows.md) for prerequisite install.
Session command cheat sheet: [docs/session-commands.md](docs/session-commands.md).
Beta priority tracker: [docs/beta-priority.md](docs/beta-priority.md).

Quick start after installing prerequisites:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

Open:

- Web: `http://localhost:3000`

## Environment

No additional environment variables are required for the current web whiteboard flow.

Useful pnpm commands:

- `pnpm session:stop` — stops services on port 3000.


