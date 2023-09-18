FROM node:20.6.1-alpine as build
WORKDIR /app
COPY . .
RUN yarn install && yarn run build:prod

FROM nginx:alpine3.18-slim
# Этап 2: Настройка Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем конфигурацию Nginx
COPY docker/v2ray-mng.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
