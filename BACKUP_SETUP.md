# CyberStories Backup System

Complete guide for backing up your codebase and blog posts.

---

## Quick Start (Local Development)

### 1. Test Backup Now

```bash
./scripts/backup.sh
```

Creates backup: `backups/backup_YYYYMMDD_HHMMSS.tar.gz`

### 2. Enable Automatic Daily Backups (Midnight)

```bash
./scripts/setup-backup-cron.sh
```

### 3. Stop Automatic Backups

```bash
./scripts/stop-backup-cron.sh
```

---

## What Gets Backed Up

✅ **Complete codebase** (app/, components/, lib/, content/, etc.)  
✅ All markdown blog posts (`.md` files)  
✅ Configuration files (package.json, docker files, tsconfig.json, etc.)  
✅ Images and PDFs from `public/`  
✅ Documentation (README.md, CHANGES.md)  

❌ **NOT backed up:** `.env.local` (secrets), `node_modules`, `.next`, `.git`, `backups/`, `logs/`

---

## Docker/Coolify Deployment

### Recommended: Host-Level Backups

**Why this is better:**
- ✅ Automatic, no manual intervention
- ✅ Backups persist even if container is destroyed/redeployed
- ✅ No Docker modifications needed
- ✅ Works perfectly with Coolify's volume mounts

### Setup on Coolify Server:

#### 1. SSH into your server:
```bash
ssh user@your-server.com
```

#### 2. Navigate to your app directory:
```bash
# Coolify stores projects in:
cd /data/coolify/applications/your-app-id/
```

#### 3. Setup automatic backups:
```bash
chmod +x scripts/backup.sh scripts/setup-backup-cron.sh scripts/stop-backup-cron.sh
./scripts/setup-backup-cron.sh
```

#### 4. Verify it's running:
```bash
crontab -l
# You should see: 0 0 * * * /path/to/scripts/backup.sh >> /path/to/logs/backup.log 2>&1
```

#### 5. Test manually (optional):
```bash
./scripts/backup.sh
ls -lh backups/
```

### Backup Location:
```
/data/coolify/applications/your-app-id/backups/
└── backup_YYYYMMDD_HHMMSS.tar.gz
```

---

## Management Commands

**View backup logs:**
```bash
tail -f logs/backup.log
```

**List all backups:**
```bash
ls -lh backups/
```

**Check if backups are active:**
```bash
crontab -l
```

**Stop automatic backups:**
```bash
./scripts/stop-backup-cron.sh
```

---

## Restore from Backup

### Local Development:
```bash
cd backups
tar -xzf backup_20250201_000000.tar.gz
cd 20250201_000000
# Your complete codebase is here!
npm install  # Reinstall dependencies
```

### Docker/Coolify:
```bash
cd /data/coolify/applications/your-app-id/backups
tar -xzf backup_20250201_000000.tar.gz
cd 20250201_000000

# Your complete codebase and blog posts are here
# Copy blog posts back if needed:
cp -r content/blog/*.md ../content/blog/
```

---

## Retention Policy

- Backups older than **30 days** are automatically deleted
- All backups are compressed (tar.gz) to save space
- Logs are kept in `logs/backup.log`

---

## Advanced: Container-Level Backups (Not Recommended)

If you want backups to run **inside** Docker (not recommended):

### Modify Dockerfile:
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app

# Install cron
RUN apk add --no-cache dcron

# ... rest of Dockerfile ...

# Copy backup scripts
COPY --from=builder /app/scripts ./scripts
RUN chmod +x scripts/backup.sh

# Setup cron job
RUN echo "0 0 * * * /app/scripts/backup.sh >> /app/logs/backup.log 2>&1" > /etc/crontabs/root

# Start both cron and Next.js
CMD crond && node server.js
```

### Update docker-compose.yml:
```yaml
services:
  app:
    volumes:
      - ./content/blog:/app/content/blog
      - ./backups:/app/backups  # Add this
```

**Cons:**
- ❌ More complex setup
- ❌ Backups lost if volume not mounted
- ❌ Requires Dockerfile modifications
- ❌ Harder to access logs

---

## Comparison: Host vs Container Backups

| Feature | Host-Level | Container-Level |
|---------|-----------|-----------------|
| **Automatic** | ✅ Yes | ✅ Yes |
| **Survives container restart** | ✅ Yes | ❌ No (unless volume mounted) |
| **Easy setup** | ✅ Yes | ❌ No (requires Dockerfile changes) |
| **Works with Coolify** | ✅ Perfect | ⚠️ Requires extra config |
| **Recommended** | ✅ **YES** | ❌ No |

---

## Scripts Overview

| Script | Purpose |
|--------|---------|
| `scripts/backup.sh` | Creates backup of entire project |
| `scripts/setup-backup-cron.sh` | Enables automatic daily backups |
| `scripts/stop-backup-cron.sh` | Disables automatic backups |

---

## Important Notes

- ✅ Backups include your **entire project** (not just blog posts)
- ✅ After restoring, run `npm install` to reinstall node_modules
- ✅ `.env.local` is excluded for security (backup manually if needed)
- ✅ Both `backups/` and `logs/` directories are gitignored
- ✅ Backups run silently in the background
- ✅ Each backup is timestamped for easy identification
- ✅ Uses `rsync` for efficient file copying

---

## Troubleshooting

**Backups not running?**
```bash
# Check if cron job exists
crontab -l

# Check logs for errors
tail -f logs/backup.log

# Test manually
./scripts/backup.sh
```

**Out of disk space?**
```bash
# Check backup sizes
du -sh backups/*

# Manually delete old backups
rm backups/backup_20240101_*.tar.gz

# Reduce retention days (edit scripts/backup.sh line 42)
```

**Need to backup .env.local?**
```bash
# Manual backup (DO NOT commit to Git)
cp .env.local backups/.env.local.backup
```

---

**Created by:** George Wanyoike Njoroge  
**Last Updated:** 2025-02-01  
**Version:** 1.0
