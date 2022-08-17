# Planner

Task tracking app with real-time collaboration, build with Django and React JS.

Video demo: [https://www.youtube.com/watch?v=1GzO4nYecYU](https://www.youtube.com/watch?v=1GzO4nYecYU)

## Backend

Backend is done with [Django](https://www.djangoproject.com/), [Django REST Framework](https://www.django-rest-framework.org/) for api calls to database, and [Django Channels](https://channels.readthedocs.io/en/stable/) for WebSocket connections for real-time collaboration.

## Frontend

Frontend is a [React](https://reactjs.org/) app with [React-router](https://reactrouter.com/), [Redux](https://redux.js.org/), [React-beutiful-dnd](https://www.npmjs.com/package/react-beautiful-dnd) for drag & drop, and [Material UI](https://mui.com/).

# Setup

## Development

- install Python >=v.3.8, NodeJS >=v.16

- download / git clone source code

- enable Python virtual environment

  ```
  $ python3 -m venv py_venv
  $ source py_venv/bin/activate
  ```

- install Python dependencies

  ```
  $ pip install -r requirements_dev.txt
  ```

- install Node dependencies

  ```
  $ npm install
  ```

- prepare frontend

  - start Webpack DevServer (running at `localost:8080`)

    ```
    $ npm run start
    ```

  - or make a Webpack bundle
    ```
    $ npm run build
    ```

- prepare and start backend (at `locahost:8000`)
  ```
  $ python manage.py makemigrations backend
  $ python manage.py migrate
  $ python manage.py runserver
  ```

## Production

- before running in production install additional Python dependencies:

  ```
  $ pip install -r requirements.txt
  ```

- expose environment variables:

  ```
  $ export DJANGO_SETTINGS_MODULE=backend.settings_prod
  $ export SECRET_KEY=[your secret key]
  $ export HOST_LOCATION=[your host location]
  ```

- make a frontend build

  ```
  $ npm run build
  ```

- collect static files

  ```
  $ python manage.py collectstatic
  ```

- run production server

  ```
  $ daphne backend.asgi:application
  ```

# Credits

Logo is a Memo emoji by [Tweemoji](https://twemoji.twitter.com/).

# License

GNU GPL v3, details at LICENSE.txt
