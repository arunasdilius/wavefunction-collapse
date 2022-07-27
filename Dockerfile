FROM node:alpine3.15

WORKDIR /home/app

RUN apk update && apk add bash

ENTRYPOINT ["tail", "-f", "/dev/null"]