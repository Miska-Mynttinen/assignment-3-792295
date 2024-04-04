#!/bin/bash

# Restart all containers defined in docker-compose.yml
docker-compose -f docker-compose.yml restart

echo "Restarted all containers."