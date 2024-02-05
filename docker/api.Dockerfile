FROM node:lts-alpine

WORKDIR /usr/src/pdfmaster

COPY  ./dist/apps/api ./

RUN npm install -g npm@10.3.0

RUN npm install

EXPOSE 3000

CMD ["node", "main"]