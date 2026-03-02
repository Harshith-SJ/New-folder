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

## 3) Java (JDK 21+)

Your environment already has Java installed.

Verify:

```powershell
java -version
javac -version
```

## 4) Docker Desktop (recommended)

Docker is optional for this milestone, but recommended for future sandbox hardening.

Verify:

```powershell
docker --version
```

## 5) Install repo dependencies

From repo root:

```powershell
pnpm install
```

## 6) Run both apps

```powershell
pnpm dev
```

This runs:

- `apps/web` on `http://localhost:3000`
- `apps/runner` on `http://localhost:4001`

## Troubleshooting

- If `pnpm` not found: rerun Corepack commands in a new terminal.
- If Java execution fails: ensure `javac` is on PATH.
- If web cannot reach runner: confirm `http://localhost:4001/health` returns JSON.
