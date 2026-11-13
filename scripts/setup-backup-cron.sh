#!/bin/bash

################################################################################
# Setup Backup Cron Job
# 
# Sets up daily backup at midnight
# 
# Usage: ./scripts/setup-backup-cron.sh
################################################################################

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_SCRIPT="${PROJECT_ROOT}/scripts/backup.sh"
LOG_DIR="${PROJECT_ROOT}/logs"
LOG_FILE="${LOG_DIR}/backup.log"

echo ""
echo "Setting up automated backup..."
echo ""

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"
echo "✓ Made backup script executable"

# Create logs directory
mkdir -p "$LOG_DIR"
echo "✓ Created logs directory"

# Cron job entry (runs daily at midnight)
CRON_JOB="0 0 * * * ${BACKUP_SCRIPT} >> ${LOG_FILE} 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo ""
    echo "Backup cron job already exists!"
    read -p "Update it? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    crontab -l | grep -v "$BACKUP_SCRIPT" | crontab -
fi

# Add cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo ""
echo "✓ Backup cron job installed!"
echo ""
echo "Schedule: Daily at midnight (00:00)"
echo "Script: ${BACKUP_SCRIPT}"
echo "Log: ${LOG_FILE}"
echo ""
echo "To test now: ${BACKUP_SCRIPT}"
echo "To view logs: tail -f ${LOG_FILE}"
echo ""
