# Planner

Task tracking app with real-time collaboration, build with Django and React JS.

Video demo: [https://www.youtube.com/watch?v=1GzO4nYecYU](https://www.youtube.com/watch?v=1GzO4nYecYU)

## Backend

Backend is done with [Django](https://www.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/) for api calls to database, and [Django Channels](https://channels.readthedocs.io/en/stable/) for WebSocket connections for real-time collaboration. Database is PostgreSQL in Docker container.

## Frontend

Frontend is a [React](https://reactjs.org/) app with [React-router](https://reactrouter.com/), [Redux](https://redux.js.org/), [React-beutiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd) for drag & drop, and [Material UI](https://mui.com/).

# Setup

Launch Database with `docker compose up -d`, or use some other DB (configure `DB_URL` in `.env`).

## Development

Script: `./setup.sh --dev`

### Backend

```bash
# move to backend dir
cd backend

# enable python virtual environment
python3 -m venv __venv__
source __venv__/bin/activate

# install dependencies
pip install -r requirements.txt

# make database migrations
python manage.py makemigrations api
python manage.py migrate

# start server
python manage.py runserver

# http://localhost:8000
```

### Frontend

```bash
# move to frontend dir
cd frontend

# install dependencies
yarn

# start devserver
yarn start

# http://localhost:8080
```

## Production

Script: `./setup.sh --prod`

```bash
# move to frontend dir
cd frontend

# install dependencies
yarn

# make a production bundle
yarn build

# move to backend dir
cd ../backend

# enable python virtual environment
python3 -m venv __venv__
source __venv__/bin/activate

# install dependencies
pip install -r requirements.txt

# make database migrations
python manage.py makemigrations api
python manage.py migrate

# collect static files
python manage.py collectstatic

# !!! update .env, or remove it and set environment variables directly

# start production server, for example:
daphne server.asgi:application -v2 --port $PORT --bind $IP
```

# Credits

Logo is a Memo emoji by [Tweemoji](https://twemoji.twitter.com/).

# License

GNU GPL v3, details at LICENSE.txt
