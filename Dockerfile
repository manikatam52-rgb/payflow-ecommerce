FROM node:20-alpine

# Install build tools required for native dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

COPY server ./

# Generate Prisma Client for the Linux container environment
RUN npx prisma generate

EXPOSE 5000
CMD ["node", "index.js"]
