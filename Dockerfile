FROM node:20-alpine

# Install build tools required for native C++ dependencies like better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server ./

EXPOSE 5000
CMD ["node", "index.js"]
