# Backend

FastAPI backend using SQLAlchemy, Alembic, and the Postgres container from the root `docker-compose.yml`.

The database is exposed on host port `5433` to avoid conflicts with a local Postgres service on `5432`.

## Setup

```bash
cd apps/backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

## Database

Start Postgres from the repository root:

```bash
npm run db:up
```

Run the migration, which creates `test_table` and seeds `apple`, `banana`, and `carrot`:

```bash
cd apps/backend
alembic upgrade head
```

## Development

```bash
fastapi dev app/main.py
```

The API runs at `http://127.0.0.1:8000` by default.

Available endpoints:

- `GET /api/list`
- `POST /api/list/add` with JSON body `{ "item": "pear" }`