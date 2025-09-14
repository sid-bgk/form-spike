# fromSpikeV2Backend

Minimal Express backend for the forms demo.

## Run

1. Install deps:
   - `cd fromSpikeV2Backend`
   - `npm install`
2. Start server:
   - Dev (auto-reload if Node >= 18): `npm run dev`
   - Prod: `npm start`

Server listens on `http://localhost:3001` by default.

## Endpoints

- `GET /api/health` — basic health check
- `GET /api/config` — temporary stub form config (will be replaced later)

