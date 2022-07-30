FROM node:16 as build

WORKDIR /usr/src/app

COPY package*.json ./

COPY . ./

RUN npm run build

# Stage - Production
FROM nginx:latest

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]