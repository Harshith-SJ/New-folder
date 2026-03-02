# Windows setup guide

Install dependencies in this order.

## 1) Node.js 22 LTS

- Install from the official Node.js site (LTS version).
- Verify:

```powershell
node -v
npm -v
```

## 2) pnpm via Corepack

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

## 3) Install repo dependencies

From repo root:

```powershell
pnpm install
```

## 4) Run app

```powershell
pnpm dev
```

This runs:

- `apps/web` on `http://localhost:3000`

## Troubleshooting

- If `pnpm` not found: rerun Corepack commands in a new terminal.
- If whiteboard does not load: confirm `http://localhost:3000/whiteboard` opens.
