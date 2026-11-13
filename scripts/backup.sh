#!/bin/bash

################################################################################
# Simple Backup Script for CyberStories Blog
# 
# Backs up codebase, markdown blog posts, and critical files
# 
# Usage: ./scripts/backup.sh
# Cron: 0 0 * * * /path/to/cyberstories/scripts/backup.sh
################################################################################

set -e

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_ROOT="${PROJECT_ROOT}/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_ROOT}/${TIMESTAMP}"

echo "Starting backup at $(date '+%Y-%m-%d %H:%M:%S')..."

# Create backup directory
mkdir -p "${BACKUP_DIR}"

# Backup entire codebase (excluding node_modules, .next, backups, logs)
echo "Backing up codebase..."
rsync -a --exclude='node_modules' \
         --exclude='.next' \
         --exclude='backups' \
         --exclude='logs' \
         --exclude='.git' \
         --exclude='.env.local' \
         "${PROJECT_ROOT}/" "${BACKUP_DIR}/"

# Create archive
echo "Creating archive..."
cd "${BACKUP_ROOT}"
tar -czf "backup_${TIMESTAMP}.tar.gz" "${TIMESTAMP}"
rm -rf "${BACKUP_DIR}"

# Cleanup old backups (keep last 30 days)
find "${BACKUP_ROOT}" -name "backup_*.tar.gz" -type f -mtime +30 -delete 2>/dev/null || true

echo "Backup completed: backup_${TIMESTAMP}.tar.gz"
echo "Location: ${BACKUP_ROOT}"
echo ""
