# syntax=docker/dockerfile:1

FROM node:21-alpine
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
CMD npm start
EXPOSE 3000