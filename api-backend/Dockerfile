# Simple Node.js backend Dockerfile (no Python)
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install production dependencies
RUN npm ci --only=production

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

# Expose Node.js server port only
EXPOSE 3000

# Development command - just run the Node.js server
CMD ["npx", "ts-node", "server.ts"]

# Production stage
FROM base AS production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Production command
CMD ["node", "dist/server.js"]