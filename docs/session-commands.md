# Session commands (with explanation)

Use these from repo root before and after each teaching session.

## 1) Start your teaching stack

```powershell
pnpm dev
```

Starts the web app:

- Web app on `http://localhost:3000`

## 2) Optional clean stop after session

```powershell
pnpm session:stop
```

Stops process on port `3000`.

## 3) Optional quick health checks

```powershell
Invoke-WebRequest http://localhost:3000/whiteboard -UseBasicParsing
```
