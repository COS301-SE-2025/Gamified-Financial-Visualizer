# Frontend production build
FROM node:20-alpine AS base

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache python3 make g++ && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm install --legacy-peer-deps --no-audit --no-fund
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Build stage
FROM base AS build
RUN npm install --legacy-peer-deps --no-audit --no-fund
COPY . .

# Build with production environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_AI_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_AI_API_URL=${REACT_APP_AI_API_URL}

RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS production

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# Create non-root user and group, but check if they already exist
RUN if ! getent group nginx; then addgroup -g 1001 -S nginx; fi && \
    if ! id -u nginx; then adduser -S nginx -u 1001 -G nginx; fi

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]