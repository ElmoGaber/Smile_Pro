# SmilePro

## Why Deploy Looks Different Than Local

If you deploy only the frontend to GitHub Pages, your `/api/*` routes do not run there.
GitHub Pages is static hosting only, so it cannot run the Node.js API server.

That means in production you need:

1. Frontend host (GitHub Pages)
2. API host (Render/Railway/Fly.io/VPS)
3. PostgreSQL database (`DATABASE_URL`) for persistent data

Without a real API + DB, bookings and promotions may work locally but not persist in deployed mode.

## Production Setup (Required)

### 1) Deploy API server separately

Deploy `artifacts/api-server` to a Node host and set:

- `PORT` (usually provided by host)
- `DATABASE_URL` (PostgreSQL connection string)

### 2) Push DB schema

Run once against your production database:

```bash
pnpm --filter @workspace/db run push
```

### 3) Configure frontend build secret in GitHub

In your GitHub repository settings:

- `Settings -> Secrets and variables -> Actions -> New repository secret`
- Add `VITE_API_BASE_URL` = your deployed API URL (example: `https://your-api.example.com`)

The GitHub Pages workflow reads this secret when building frontend assets.

### 4) Redeploy frontend

Push to `main` (or run workflow manually) so the Pages build picks the new API URL.

## Quick Production Checklist

- API URL works: `GET https://your-api.example.com/api/services` returns `200`
- Database is connected (`DATABASE_URL` valid)
- GitHub secret `VITE_API_BASE_URL` is set
- Latest GitHub Pages workflow run is green

## Important Notes

- Admin login in this project is currently a frontend password gate, not a secure server session.
- If production API has no database, server may fallback to in-memory behavior and data can disappear after restart.

