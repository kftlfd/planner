#!/bin/bash

# for deployment on Heroku

echo '--- preparing database ---'
python3 manage.py makemigrations backend
python3 manage.py migrate

echo '--- collecting static files ---'
python3 manage.py collectstatic --noinput
