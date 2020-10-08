FROM node:14.13.0

USER root

RUN mkdir /app

WORKDIR /app

RUN npm install -g nodemon typescript sequelize-cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["nodemon", "./dist/server.js"]