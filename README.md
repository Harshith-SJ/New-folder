# Java Teaching Whiteboard (Solo Instructor)

Modern whiteboard built for solo Java teaching via screen-sharing and recording.

## Features in this milestone

- Full-screen whiteboard canvas using `tldraw`
- Java teaching panel with Monaco editor, stdin, and output console
- Local shape recognition assistant (line/rectangle/circle/arrow/freehand)
- Local handwriting mode assistant (ink/text/hybrid guidance)
- Local autosave + restore of lesson title and Java code
- Java compile/run API (`Main.java` snippet flow)

## Tech stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- Whiteboard: tldraw
- Code editor: Monaco (`@monaco-editor/react`)
- Runner API: Node.js + Express + OpenJDK

## Project structure

- `apps/web` — UI, whiteboard, Java editor, API proxy route
- `apps/runner` — `/run-java` endpoint for compile/execute

## Setup (Windows)

Follow [docs/setup-windows.md](docs/setup-windows.md) for prerequisite install.

Quick start after installing prerequisites:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

Open:

- Web: `http://localhost:3000`
- Runner health: `http://localhost:4001/health`

## Environment

Copy `.env.example` to `.env` if needed:

```powershell
Copy-Item .env.example .env
```

Default runner URL is already `http://localhost:4001`.

