FROM node:20.6.1-alpine as build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build:prod


