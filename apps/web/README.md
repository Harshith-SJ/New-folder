# Web Whiteboard Usage Guide

This app is a minimal free-drawing whiteboard built with Next.js + tldraw.

## Start

From repo root:

```powershell
pnpm install
pnpm dev
```

Open:

- http://localhost:3000/whiteboard

If port `3000` is busy:

```powershell
pnpm session:stop
pnpm dev
```

## How to Use

- Draw freely on the canvas with mouse, touch, or pen tablet.
- Hold `Shift` while drawing to enable shape auto-snap.
- Auto-snap supports:
  - Rectangle
  - Circle
  - Arrow
- Without `Shift`, strokes stay as normal freehand writing/drawing.

## Current UI

- Session title field at the top
- Full whiteboard canvas

## Dev Check

```powershell
pnpm --filter web typecheck
```
