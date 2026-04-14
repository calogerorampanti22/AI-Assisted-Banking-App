# Stage 1: Build di React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Server Nginx per servire i file statici
FROM nginx:stable-alpine

# Copio la configurazione personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html
# COnfigurazione per React Router
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]