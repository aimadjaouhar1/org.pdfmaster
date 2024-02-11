FROM node:slim

WORKDIR /usr/src/pdfmaster

COPY  ./dist/apps/api ./

RUN npm install

EXPOSE 3000

CMD ["node", "main"]