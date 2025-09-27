# Multi-stage build for Node.js backend
FROM node:18-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
    python3 \
    && rm -rf /var/cache/apk/*

# Create app directory with proper permissions
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs && \
    chown -R nodejs:nodejs /app

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs tsconfig.json ./

# Install production dependencies only
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Development stage
FROM base AS development
USER root
RUN npm ci --no-audit --no-fund
COPY --chown=nodejs:nodejs . .
USER nodejs
EXPOSE 3000
CMD ["dumb-init", "npx", "ts-node", "server.ts"]

# Build stage
FROM base AS build
USER root
RUN npm ci --no-audit --no-fund
COPY --chown=nodejs:nodejs . .
RUN npm run build && \
    npm prune --production --no-audit --no-fund

# Production stage
FROM node:18-alpine AS production

# Install security updates and dumb-init
RUN apk update && apk upgrade && apk add --no-cache \
    dumb-init \
    curl \
    python3 \
    py3-pip \
    gcc \
    g++ \
    musl-dev \
    linux-headers \
    python3-dev \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/cache/apk/*
    
COPY backend-requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r backend-requirements.txt

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

WORKDIR /app

RUN mkdir -p /tmp/uploads && chown -R nodejs:nodejs /tmp/

# Copy built application and dependencies
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./

COPY --chown=nodejs:nodejs modules/ai/app/classifier/services/extractors/ ./dist/modules/ai/app/classifier/services/extractors/


# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
CMD ["dumb-init", "node", "dist/server.js"]