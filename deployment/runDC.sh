#! /bin/bash

# check for -d, --detached
DETACHED=false
for (( i=1; i <= "$#"; i++ )); do
  ARG="${!i}"
  case "$ARG" in
    -d|--detach)
      DETACHED=true
      break
      ;;
  esac
done

DOCKER_BUILDKIT=1
COMPOSE_DOCKER_CLI_BUILD=1


if [[ $2 == "up" ]] && [[ $DETACHED == false ]]; then
    docker-compose -f $1 up --build; docker-compose -f $1 down
else
    break
fi