#!/bin/bash

# for deployment on Heroku
python3 manage.py makemigrations backend
python3 manage.py migrate
