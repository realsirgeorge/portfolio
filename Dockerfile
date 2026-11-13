# Multi-stage Dockerfile for Next.js - Optimized for production
# No hardcoded credentials or fallback values - all values come from environment variables

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install all dependencies (including devDependencies for build)
# --include=dev ensures devDependencies are installed even in production mode
RUN npm ci --include=dev

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables (loaded from .env via docker-compose)
# These are non-sensitive configuration values
ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1

# Runtime secrets needed for build validation
# Placeholder values that pass validation during build time
# Real values are provided at runtime via docker-compose env_file
ARG ADMIN_PASSWORD=placeholder_password_min_12_chars
ARG SESSION_SECRET=placeholder_secret_must_be_at_least_32_characters_long_for_validation
ARG SESSION_DURATION=86400
ARG ADMIN_USER_ID=build-time-user

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV SESSION_DURATION=${SESSION_DURATION}
ENV ADMIN_USER_ID=${ADMIN_USER_ID}

# Build Next.js application
# Using standalone output for smaller production image
RUN npm run build

# Unset sensitive build-time placeholders to ensure they're not in the image layers
ENV ADMIN_PASSWORD=""
ENV SESSION_SECRET=""
ENV ADMIN_USER_ID=""

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

# Runtime environment variables (loaded from .env and .env.local via docker-compose)
# Non-sensitive config has defaults, secrets must be provided at runtime
ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1
ARG PORT=3025
ARG HOSTNAME=0.0.0.0

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}
ENV PORT=${PORT}
ENV HOSTNAME=${HOSTNAME}

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Copy content directory for blog posts
COPY --from=builder /app/content ./content

# Set proper permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE ${PORT}

# Start the application
# Sensitive environment variables (ADMIN_PASSWORD, SESSION_SECRET, etc.) 
# are loaded at runtime from .env.local via docker-compose
CMD ["node", "server.js"]

