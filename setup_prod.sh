#!/bin/bash

cd frontend

echo '--- building frontend ---'
npm run build

cd ..

echo '--- preparing database ---'
python3 manage.py makemigrations backend
python3 manage.py migrate

echo '--- collecting static files ---'
python3 manage.py collectstatic --noinput
