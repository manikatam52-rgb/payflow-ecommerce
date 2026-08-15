# Step 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client ./
RUN npm run build

# Step 2: Build Backend & Production Image
FROM node:20-alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server files
COPY server ./
RUN npx prisma generate

# Copy built frontend assets to server public folder
COPY --from=frontend-builder /app/client/dist ./public

EXPOSE 5000
CMD ["npm", "start"]
