# Build React
FROM node:20-alpine as build

WORKDIR /app
ARG VITE_API_URL=https://api-doc-is-hgg7g4d9e2fagpgt.francecentral-01.azurewebsites.net
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
