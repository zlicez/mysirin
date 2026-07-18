#!/bin/sh
set -eu

app_dir="${APP_DIR:-/opt/sirin}"
backup_dir="$app_dir/backups"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
work_dir="$(mktemp -d)"
trap 'rm -rf "$work_dir"' EXIT

install -d -m 0700 "$backup_dir"
sqlite3 "$app_dir/data/sirin.db" ".backup '$work_dir/sirin.db'"
cp "$app_dir/.env" "$work_dir/production.env"

tar -czf "$backup_dir/sirin-$stamp.tar.gz" \
  -C "$work_dir" sirin.db production.env \
  -C "$app_dir" uploads
chmod 600 "$backup_dir/sirin-$stamp.tar.gz"

find "$backup_dir" -type f -name 'sirin-*.tar.gz' -mtime +14 -delete
