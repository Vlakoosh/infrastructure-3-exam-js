# Stage 1: Install dependencies
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build final image
FROM node:20-slim AS production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
