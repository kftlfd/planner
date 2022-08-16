#!/bin/bash

# check for python venv
if [[ ! -d /py_venv ]]
then
    echo '--- creating python environment ---'
    python3 -m venv py_venv
fi

echo '--- activate python virtual environment ---'
source py_venv/bin/activate

echo '--- instlling python modules ---'
pip install -r requirements.txt

echo '--- preparing database ---'
python3 manage.py makemigrations backend
python3 manage.py migrate

echo '--- installing npm packages ---'
npm i --legacy-peer-deps

echo ''
echo '--- setup completed ---'
echo ''
echo 'start frontend devserver with:'
echo '$ npm run start'
echo ''
echo 'start backend with: (make sure the python venv is enabled)'
echo '$ python manage.py runserver'
