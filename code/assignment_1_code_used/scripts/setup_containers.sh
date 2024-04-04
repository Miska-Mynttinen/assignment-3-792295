#!/bin/bash

# Set up mongoDB first because others depend on it
docker-compose -f docker-compose.yml up -d mongo

sleep 1

# Setup and start all containers defined in docker-compose.yml
echo "Setting up other containers."

docker-compose -f docker-compose.yml up -d

# List all containers
docker-compose -f docker-compose.yml ps

sleep 1

# Execute commands inside the container to install Python and PySpark
docker exec -it mysimbdp /bin/bash -c 'apt update && apt install -y python3 && apt install -y python3-pip && apt install default-jdk'

docker exec -it mysimbdp /bin/bash -c 'echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" >> ~/.bashrc && source ~/.bashrc'

docker exec -it mysimbdp /bin/bash -c 'apt install python3.11-venv && python3 -m venv .venv && source .venv/bin/activate && python3 -m pip install pyspark[sql]'

echo "Setup complete."
