#!/bin/bash

# check for python venv
if [[ ! -d /.venv ]]
then
    echo '--- creating python environment ---'
    python3 -m venv .venv
fi

echo '--- activate python virtual environment ---'
source .venv/bin/activate

echo '--- instlling python modules ---'
pip install -r requirements.txt

cd frontend

echo '--- installing npm packages ---'
npm i --force

echo '--- building frontend ---'
npm run build

cd ..

echo '--- preparing database ---'
python3 manage.py makemigrations backend
python3 manage.py migrate

echo '--- collecting static files ---'
python3 manage.py collectstatic --noinput
