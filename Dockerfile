FROM node:20.6.1-alpine as build
WORKDIR /app
COPY . .
RUN apk add git bash
RUN git config url."https://".insteadOf git://
RUN yarn add @vue/cli
RUN yarn install
RUN yarn run build:prod


