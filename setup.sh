#!/bin/bash

# Build containers from app source code
build() {
  docker rm mongodb
  coker rm abr

  npm run install
  npm run build
  docker build -t btravers/abr:0.0.0 .

  docker run --name mongodb -v data:/data/db -p 27017:27017 -d mongo:3
  docker run --name abr -p 3000:3000 btravers/abr:0.0.0
}

# Start containers
start() {
  docker start mongodb
  docker start abr
}

# Stop containers
stop() {
  docker stop abr
  docker stop abr
}

# Restart containers
restart() {
  stop
  start
}

case $1 in
  build)
    build
  ;;
  start)
    start
  ;;
  stop)
    stop
  ;;
  restart)
    restart
  ;;
  *)
    echo $"Usage $0 {build|start|stop|restart}"
  ;;
esac

exit 0
