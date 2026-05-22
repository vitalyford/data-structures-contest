# Data Structures Contest

A timed, interactive contest platform for data structures (stacks, queues, graphs). Students solve problems in-browser; an admin panel controls sessions and a live leaderboard tracks scores.

## Run locally (dev)

**Prerequisites:** Node.js 20+

```sh
# Backend
cd backend
cp .env.example .env   # edit values as needed
npm install
npm run dev

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173, backend on http://localhost:3001. The Vite dev server proxies `/api` to the backend.

## Run in production (Docker Compose)

Create a `.env` file in the repo root (next to `compose.yml`):

```
JWT_SECRET=<long random string>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong password>
```

Then:

```sh
docker compose up -d --build
```

The app is served on port 80 via nginx.

## Environment variables

These are set in `backend/.env` for local dev, or in the root `.env` for Docker Compose.

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret used to sign JWT tokens. Use a long random string. |
| `ADMIN_USERNAME` | Username for the admin panel. |
| `ADMIN_PASSWORD` | Password for the admin panel. |
| `PORT` | Port the backend listens on. Defaults to `3001`. |

## Admin panel

Navigate to `/admin` and log in with the credentials above. From there you can create/start/stop contest sessions, assign groups, and view submissions.

## Data persistence

The SQLite database is stored in `backend/data/`. In Docker, it is persisted via the `backend_data` named volume. To reset all data, remove the volume: `docker compose down -v`.
