#!/bin/bash

B="\e[1;43;34m\n ---";
E="---\e[0m\n";

echo -e "\nsetting up Planner for development";

# default
if [ $# -eq 0 ];
then

    # check for python venv
    if [[ ! -d "py_venv" ]];
    then
        echo -e "$B creating python environment $E";
        python3 -m venv py_venv;
    fi

    echo -e "$B activate python virtual environment $E";
    source py_venv/bin/activate;

    echo -e "$B instlling python modules $E";
    pip install -r requirements_dev.txt;

    echo -e "$B preparing database $E";
    python3 manage.py makemigrations backend;
    python3 manage.py migrate;

    echo -e "$B installing npm packages $E";
    npm i --legacy-peer-deps;

    echo -e "$B setup completed $E";

    echo "start frontend devserver with:";
    echo "$ npm run start";
    echo "";
    echo "start backend with:";
    echo "(py_venv) $ python manage.py runserver";

    exit 0;

# for cs50 VSCode codespace
elif [ "$1" = "--cs50" ];
then

    echo -e "$B installing npm packages $E";
    npm i;

    echo -e "$B building frontend $E";
    npm run build;

    if [[ ! -d "py_venv" ]]
    then
        echo -e "$B creating python environment $E";
        python3 -m venv py_venv;
    fi

    echo -e "$B activate python virtual environment $E";
    source py_venv/bin/activate;

    echo -e "$B instlling python modules $E";
    pip install -r requirements_dev.txt;

    echo -e "$B preparing database $E";
    python3 manage.py makemigrations backend;
    python3 manage.py migrate;

    echo -e "$B starting Django server $E";
    python manage.py runserver;

else
    echo "usage: ./setup_dev.sh [--cs50]";
    exit 1;

fi
