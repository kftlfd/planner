HOST ?= "localhost"
PORT ?= "8000"

install:
	poetry install

db-migrate:
	poetry run ./manage.py makemigrations api
	poetry run ./manage.py migrate

dev:
	poetry run ./manage.py runserver ${PORT}

prep-static:
	poetry run ./manage.py collectstatic -c -l --noinput

start:
	poetry run daphne server.asgi:application -v2 --bind=${HOST} --port=${PORT}

lint:
	poetry run ruff check

format:
	poetry run ruff format
