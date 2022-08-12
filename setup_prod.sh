#!/bin/bash

cd frontend

echo '--- installing npm packages ---'
npm i --force

echo '--- building frontend ---'
npm run build

cd ..

echo '--- preparing database ---'
rm db.sqlite3
python3 manage.py makemigrations backend
python3 manage.py migrate

echo '--- collecting static files ---'
python3 manage.py collectstatic --noinput
