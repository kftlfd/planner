FROM python:3.9-alpine
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
