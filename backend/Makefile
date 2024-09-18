install:
	poetry install

dev:
	poetry run ./manage.py runserver

prep-static:
	poetry run ./manage.py collectstatic

start:
	poetry run daphne server.asgi:application -v2 --port=8000

lint:
	poetry run ruff check

format:
	poetry run ruff format