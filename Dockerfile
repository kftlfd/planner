# syntax = docker/dockerfile:1.2

FROM node:20-alpine AS fe
WORKDIR /app/frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm run build

FROM python:3.9-alpine
WORKDIR /app/backend
ENV PIP_CACHE_DIR="/var/cache/pip"
RUN mkdir -p $PIP_CACHE_DIR
ENV POETRY_CACHE_DIR="/var/cache/poetry"
RUN mkdir -p $POETRY_CACHE_DIR
COPY ./backend/pyproject.toml ./backend/poetry.lock ./
RUN --mount=type=cache,id=pip,target=/var/cache/pip pip install -U pip setuptools
RUN --mount=type=cache,id=pip,target=/var/cache/pip pip install poetry
RUN --mount=type=cache,id=apk,target=/var/cache/apk apk add make
RUN poetry env use system
COPY backend .
RUN --mount=type=cache,id=poetry,target=/var/cache/poetry make install
COPY --from=fe /app/frontend/dist /app/frontend/dist
RUN make prep-static

EXPOSE 8000
CMD [ "make", "start" ]
