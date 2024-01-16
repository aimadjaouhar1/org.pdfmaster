FROM nginx:stable-alpine

COPY  ./dist/apps/web /usr/share/nginx/html/