# Use the official Python image as the base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y gcc build-essential libopenblas-dev liblapack-dev gfortran && \
    rm -rf /var/lib/apt/lists/*

RUN pip install cython

# Copy the requirements file into the container
COPY requirements.txt ./

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . .

# Expose the backend server's port (e.g., 5000 for Flask)
EXPOSE 8000

ENV MODULE_NAME=main:app
ENV HOST=0.0.0.0
ENV PORT=8000

CMD uvicorn --host $HOST --port $PORT $MODULE_NAME