#!/bin/bash

PROJECT_ROOT="$(dirname -- "$(readlink -f "${BASH_SOURCE}")")";
BACKEND_DIR="$PROJECT_ROOT/backend";
FRONTEND_DIR="$PROJECT_ROOT/frontend";

WHITE_BOLD="\e[1;37m";
END_COLOR="\e[0m";


message() {
    echo -e "$WHITE_BOLD--- $1 ---$END_COLOR";
}


setup-backend() {
    cd $BACKEND_DIR;

    if [[ ! -d "__venv__" ]];
    then
        message "creating python environment";
        python3 -m venv __venv__;
    fi

    message "activate python virtual environment";
    source __venv__/bin/activate;

    message "installing python dependencies";
    pip install -r requirements.txt;

    message "preparing database";
    python3 manage.py makemigrations api;
    python3 manage.py migrate;
}


setup-dev() {
    message "Setting up Planner for development";

    setup-backend;

    cd $FRONTEND_DIR

    message "installing npm packages";
    yarn;

    message "setup completed";

    echo "";
    echo "To start frontend devserver:";
    echo "$ cd frontend";
    echo "$ yarn start";
    echo "";
    echo "To start backend server:";
    echo "$ cd backend";
    echo "$ source __venv__/bin/activate";
    echo "(__venv__) $ python manage.py runserver";
    echo "";
    echo "Don't forget to configure/launch database!";
    echo "";

    exit 0;
}


setup-prod() {
    message "Setting up Planner for production";

    cd $FRONTEND_DIR;

    message "installing npm packages";
    yarn;

    message "building frontend";
    yarn build;

    setup-backend;

    cd $BACKEND_DIR;

    message "collecting static files";
    python manage.py collectstatic;

    message "setup completed";

    echo ""
    echo "App is ready for deployment."
    echo "$ ./setup.sh --deploy";
    echo "";
    echo "Don't forget to configure/launch database!";
    echo ""

    exit 0;
}


deploy() {
    cd $BACKEND_DIR;

    daphne server.asgi:application --port 3000 -v2
}


### Development
if [[ $# == 0 || "$1" == "--dev" ]];
then
setup-dev;


### Production
elif [[ "$1" == "--prod" ]];
then
setup-prod;


### Deploy
elif [[ "$1" == "--deploy" ]];
then
deploy;


### Wrong usage
else
    echo "usage: ./setup.sh [--dev|--prod|--deploy]";
    exit 1;
fi
