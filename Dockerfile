FROM node:14.13.0

USER root

RUN mkdir /app

WORKDIR /app

RUN npm install -g nodemon typescript

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["nodemon", "./dist/app/server.js"]