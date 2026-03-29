# ---- Stage 1 -build----

FROM node:20-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Stage 2 - Production ---
FROM nginx:alpine

# Copy custom nginx config for reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
