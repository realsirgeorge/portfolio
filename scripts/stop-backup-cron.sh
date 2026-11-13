#!/bin/bash

################################################################################
# Stop Automated Backup Cron Job
# 
# Removes the backup cron job
# 
# Usage: ./scripts/stop-backup-cron.sh
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_SCRIPT="${PROJECT_ROOT}/scripts/backup.sh"

echo ""
echo "Stopping automated backup..."
echo ""

# Check if cron job exists
if ! crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo "✗ No backup cron job found"
    echo ""
    exit 0
fi

# Show current cron job
echo "Current backup cron job:"
crontab -l | grep "$BACKUP_SCRIPT"
echo ""

# Confirm removal
read -p "Remove this cron job? (y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Remove the cron job
crontab -l | grep -v "$BACKUP_SCRIPT" | crontab -

echo ""
echo "✓ Backup cron job removed!"
echo ""
echo "Automated backups are now stopped."
echo "You can still run manual backups with: ./scripts/backup.sh"
echo ""



