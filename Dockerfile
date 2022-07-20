FROM node:alpine3.15

RUN apk update && apk add bash

ENTRYPOINT ["tail", "-f", "/dev/null"]