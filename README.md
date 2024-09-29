# v2 Changelog

Code setup, organization and tooling improvements. The actual app logic (frontend components, API endpoints) is mostly unchanged (so, remains mostly not good)

- split backend and frontend code
- added Python and Node versions
- add Dockerfile with docker-compose for production build of the planner
- removed setup.sh script

### Backend

- restructured source code (api Django app, and separate api modules)
- use Poetry for dependency management
- use Ruff linter + formatter
- added Makefile with main commands
- `migrate.sh` script for migrations Docker service (tries to apply migrations with retries after interval)
- added `.python-version` file for PyEnv
- changed default .env to use Sqlite db for development by default

### Frontend

- changed package manager to pnpm@8
- migrated from Webpack to Vite
- removed sass, styling only with MUI
- removed unused dependencies
- replaced react-beautiful-dnd (abandoned) with @hello-pangea/dnd (a maintained fork)
- migrated all code to Typescript
- add Eslint + Prettier
- fixing of typescript/eslint errors
- added code splitting

---

# Planner

Task tracking app with real-time collaboration, build with Django and React JS.

Video demo: [https://www.youtube.com/watch?v=1GzO4nYecYU](https://www.youtube.com/watch?v=1GzO4nYecYU)

**Backend:**

- Python 3.9+, [Poetry](https://python-poetry.org/)
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/en/stable/)
- SQLite/PostrgeSQL DB.

**Frontend:**

- NodeJS 18+, [pnpm](https://pnpm.io/), [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [React-router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material UI](https://mui.com/).

# Setup

## Backend

in `backend` dir:

0. Requirements:
   - Python 3.9+ (e.g. with [PyEnv](https://github.com/pyenv/pyenv) `pyenv install`, and create venv `python -m venv .venv`)
   - [Poetry](https://python-poetry.org/)
   - make (optional, can just use commands from the Makefile instead)
1. create .env: `cp .env.example .env`
2. `make install`
3. `make db-migrate`
4. start dev server: `make dev`

By default runs on `localhost:8000` (configure port in Makefile),  
expects frontend on `localhost:8080` (configure `CSRF_ORIGIN` in `.env`).

## Frontend

in `frontend` dir

0. Requirements:
   - Node 18+ (e.g. with [n](https://github.com/tj/n) `n auto`)
   - pnpm 8 (`corepack enable`, `corepack up`)
1. `pnpm install`
2. `pnpm run dev`

By default runs on `localhost:8080` (configure in `vite.config.ts`),  
if changing backend location/port, update proxies in `vite.config.ts`.

## Build

`DIR$` means that the command should be run in the `DIR` directory

1. `frontend$` `pnpm run build`
2. `backend$` `make prep-static`
3. `backend$` `make start`

## Docker

PostgreSQL DB + DB migrations service + app build

Run: `docker compose up --build`

# Credits

Logo is a Memo emoji by [Tweemoji](https://twemoji.twitter.com/).

# License

GNU GPL v3, details at LICENSE.txt
