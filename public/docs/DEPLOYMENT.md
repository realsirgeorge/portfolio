# Deployment Guide

## Environment Configuration

This project uses a two-file environment configuration system:

### 1. `.env` - Docker/Build Configuration (Safe to commit)
Contains non-sensitive Docker and build settings:
- `PORT` - Application port
- `NODE_ENV` - Node environment
- `NEXT_TELEMETRY_DISABLED` - Telemetry setting
- `HOSTNAME` - Container hostname

**This file is safe to commit to Git** as it contains no secrets.

### 2. `.env.local` - Next.js Runtime Secrets (DO NOT commit)
Contains sensitive application secrets:
- `ADMIN_PASSWORD` - Admin panel password
- `SESSION_SECRET` - Session signing secret
- `SESSION_DURATION` - Session duration in seconds
- `ADMIN_USER_ID` - Admin user identifier

**This file must NEVER be committed to Git** as it contains sensitive credentials.

## Setup Instructions

### Local Development

1. Copy the example files:
```bash
cp .env.example .env
cp .env.local.example .env.local
```

2. Edit `.env.local` and fill in your secure values:
```bash
# Generate a secure password
ADMIN_PASSWORD=your_secure_password

# Generate a session secret (minimum 32 characters)
SESSION_SECRET=$(openssl rand -hex 32)

# Set session duration (7 days = 604800 seconds)
SESSION_DURATION=604800

# Set admin user ID
ADMIN_USER_ID=admin
```

3. Start the development server:
```bash
npm run dev
```

### Docker Deployment

1. Ensure both `.env` and `.env.local` files exist with proper values

2. Build and run with Docker Compose:
```bash
docker-compose up -d
```

3. Check container health:
```bash
docker-compose ps
docker-compose logs -f app
```

### Coolify Deployment

1. Push your code to Git (`.env.local` will be ignored automatically)

2. In Coolify, set the following environment variables:
   - `ADMIN_PASSWORD` - Your secure admin password
   - `SESSION_SECRET` - Your session secret (32+ characters)
   - `SESSION_DURATION` - Session duration in seconds (e.g., 604800)
   - `ADMIN_USER_ID` - Admin user ID (e.g., admin)

3. Coolify will automatically:
   - Use `.env` for Docker configuration
   - Inject the secrets as environment variables at runtime
   - Handle reverse proxying (no need for Nginx)

## Security Notes

### No Fallback Values
- All environment variables are **required**
- No default or fallback values exist in the code
- Application will fail to start if required variables are missing
- This ensures no accidental use of insecure defaults

### Environment Variable Validation
The application validates all environment variables on startup:
- `ADMIN_PASSWORD` - Must be set (minimum 12 characters recommended)
- `SESSION_SECRET` - Must be at least 32 characters
- `SESSION_DURATION` - Must be a positive number
- Missing or invalid values will cause startup failure

### File Structure
```
.env                    # Docker config (safe to commit)
.env.example           # Docker config template (safe to commit)
.env.local             # Next.js secrets (DO NOT commit)
.env.local.example     # Secrets template (safe to commit)
```

## Troubleshooting

### Container fails to start
1. Check environment variables are set:
```bash
docker-compose config
```

2. Check container logs:
```bash
docker-compose logs app
```

3. Verify `.env.local` exists and contains all required variables

### Health check failing
1. Check if the application is running:
```bash
curl http://localhost:3000/api/health
```

2. Check port configuration in `.env`:
```bash
cat .env | grep PORT
```

### Cannot login to admin panel
1. Verify `ADMIN_PASSWORD` in `.env.local` matches what you're entering
2. Check session secret is set and at least 32 characters
3. Restart the container after changing environment variables

## Backup Strategy

### What to backup
1. **Blog content**: `./content/blog/` directory
2. **Environment secrets**: `.env.local` (store securely, not in Git)
3. **Public assets**: `./public/` directory

### What NOT to backup
- `node_modules/` - Can be reinstalled
- `.next/` - Build artifacts, regenerated on build
- Docker images - Can be rebuilt

## Production Checklist

- [ ] `.env` file exists with correct port and settings
- [ ] `.env.local` file exists with secure values
- [ ] `ADMIN_PASSWORD` is strong (12+ characters)
- [ ] `SESSION_SECRET` is at least 32 characters
- [ ] `.env.local` is NOT committed to Git
- [ ] Health check endpoint is accessible
- [ ] Blog content directory is mounted/persisted
- [ ] Container restarts automatically (`restart: unless-stopped`)
- [ ] Security headers are configured in `next.config.mjs`
- [ ] Application runs as non-root user (handled by Dockerfile)

## Monitoring

### Health Check
The application exposes a health check endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok"}
```

### Docker Health Status
```bash
docker-compose ps
```

Healthy container shows: `Up X minutes (healthy)`

### Logs
```bash
# Follow logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

## Updates and Maintenance

### Updating the application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Check health
docker-compose ps
```

### Updating environment variables
1. Edit `.env` or `.env.local`
2. Restart the container:
```bash
docker-compose restart app
```

### Backing up blog posts
```bash
# Create backup
tar -czf blog-backup-$(date +%Y%m%d).tar.gz content/blog/

# Restore backup
tar -xzf blog-backup-YYYYMMDD.tar.gz
```

## Environment Configuration Details

### New Two-File System

#### 1. `.env` (Safe to commit)
**Purpose**: Docker and build configuration
**Contains**:
- `PORT=3000`
- `NODE_ENV=production`
- `NEXT_TELEMETRY_DISABLED=1`
- `HOSTNAME=0.0.0.0`

**Status**: ✅ Safe to commit to Git (no secrets)

#### 2. `.env.local` (DO NOT commit)
**Purpose**: Next.js runtime secrets
**Contains**:
- `ADMIN_PASSWORD` - Your admin password
- `SESSION_SECRET` - Session signing secret
- `SESSION_DURATION` - Session duration
- `ADMIN_USER_ID` - Admin user ID

**Status**: ❌ Never commit to Git (contains secrets)

### Updated Files

#### `Dockerfile`
- ✅ Removed all hardcoded values
- ✅ Removed all fallback values (no `||`, no `??`, no defaults)
- ✅ Uses ARG/ENV from docker-compose
- ✅ All values must be provided at runtime

**Key changes**:
```dockerfile
ARG NODE_ENV
ARG PORT
ENV NODE_ENV=${NODE_ENV}  # No fallback
ENV PORT=${PORT}          # No fallback
```

#### `docker-compose.yml`
- ✅ Removed all hardcoded values
- ✅ Uses `${PORT}` instead of `3000`
- ✅ Loads both `.env` and `.env.local`
- ✅ Passes build args from environment

**Key changes**:
```yaml
ports:
  - "${PORT}:${PORT}"  # No hardcoded port
env_file:
  - .env           # Docker config
  - .env.local     # Secrets
```

#### `.gitignore`
- ✅ Updated to ignore only `.env.local` and `.env*.local`
- ✅ `.env` is now safe to commit

#### `.dockerignore`
- ✅ Updated to ignore only `.env.local`
- ✅ `.env` is included in Docker build (needed for config)

#### Template Files Created
- `.env.example` - Template for Docker configuration
- `.env.local.example` - Template for Next.js secrets (updated)

## Verification

### No Fallback Values ✅
```bash
# Searched for fallback patterns - NONE FOUND
grep -r "||" Dockerfile docker-compose.yml
grep -r "??" Dockerfile docker-compose.yml
grep -r ":-" Dockerfile docker-compose.yml
```

### No Hardcoded Credentials ✅
```bash
# All values come from environment variables
# No defaults in Dockerfile or docker-compose.yml
```

### Environment Variable Flow ✅
```
.env (Docker config)
    ↓
docker-compose.yml (loads .env + .env.local)
    ↓
Dockerfile (receives as ARG, sets as ENV)
    ↓
Next.js Application (reads from process.env)
    ↓
lib/env.ts (validates, throws if missing)
```

## Security Features

### 1. No Fallback Values
- All environment variables are **required**
- Application will **fail to start** if any are missing
- No risk of using insecure defaults

### 2. Validation on Startup
`lib/env.ts` validates:
- `ADMIN_PASSWORD` - Must be set
- `SESSION_SECRET` - Must be ≥32 characters
- `SESSION_DURATION` - Must be positive number
- Throws errors if validation fails

### 3. Separation of Concerns
- **Docker config** (`.env`) - Safe to commit
- **Application secrets** (`.env.local`) - Never committed

### 4. Build-time vs Runtime
- **Build-time** (ARG): `NODE_ENV`, `NEXT_TELEMETRY_DISABLED`
- **Runtime** (ENV): All variables including secrets

## What Gets Committed

### ✅ Safe to Commit
- `.env` - Docker configuration (no secrets)
- `.env.example` - Docker config template
- `.env.local.example` - Secrets template
- `Dockerfile`
- `docker-compose.yml`

### ❌ Never Commit
- `.env.local` - Contains secrets
- `.env*.local` - Any local environment files

## Testing

### Verify no fallbacks
```bash
# Should find NO matches
grep -E "\|\||default|:-" Dockerfile docker-compose.yml
```

### Verify environment loading
```bash
# Check what docker-compose will use
docker-compose config

# Should show values from .env and .env.local
```

### Verify application startup
```bash
# Start container
docker-compose up -d

# Check logs for validation errors
docker-compose logs app

# Should see no environment validation errors
```

## Summary

✅ **No hardcoded values** - All from environment  
✅ **No fallback values** - Application fails if missing  
✅ **Separation of concerns** - Docker config vs secrets  
✅ **Secure by default** - Validates on startup  
✅ **Git-safe** - Secrets never committed  
✅ **Production-ready** - Works with Coolify  

All environment variables are now properly externalized with no hardcoded or fallback values!
