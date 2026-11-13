# Backup Scripts

Simple automated backup system for CyberStories blog.

---

## Scripts

| Script | Purpose |
|--------|---------|
| `backup.sh` | Creates backup of entire project |
| `setup-backup-cron.sh` | Enables automatic daily backups (midnight) |
| `stop-backup-cron.sh` | Disables automatic backups |

---

## Quick Usage

```bash
# Test backup now
./scripts/backup.sh

# Enable automatic backups
./scripts/setup-backup-cron.sh

# Stop automatic backups
./scripts/stop-backup-cron.sh
```

---

## Complete Documentation

For full documentation including Docker/Coolify setup, restoration, and troubleshooting:

📖 **See:** `BACKUP_SETUP.md` in project root
