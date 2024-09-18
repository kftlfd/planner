FROM node:20-alpine AS fe
COPY frontend /app/frontend
WORKDIR /app/frontend

RUN corepack enable
RUN pnpm install
RUN pnpm run build

FROM python:3.9-alpine
COPY backend /app/backend
COPY --from=fe /app/frontend/dist /app/frontend/dist
WORKDIR /app/backend

RUN apk add --no-cache make
RUN pip install -U pip setuptools
RUN pip install poetry
RUN poetry env use system
RUN make install
RUN make prep-static

EXPOSE 8000
CMD [ "make", "start" ]
