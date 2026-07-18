#!/usr/bin/env bash
set -euo pipefail

repo_url="${SIRIN_REPO_URL:-https://github.com/zlicez/mysirin.git}"
repo_dir="${SIRIN_REPO_DIR:-/opt/sirin-repo}"
app_dir="${SIRIN_APP_DIR:-/opt/sirin}"
branch="${SIRIN_DEPLOY_BRANCH:-master}"

exec 9>/run/lock/sirin-deploy.lock
flock -n 9 || exit 0

if [ ! -d "$repo_dir/.git" ]; then
  git clone --filter=blob:none --branch "$branch" "$repo_url" "$repo_dir"
fi

git -C "$repo_dir" fetch --prune origin "$branch"
next_commit="$(git -C "$repo_dir" rev-parse "origin/$branch")"
current_commit="$(cat "$app_dir/.deployed-commit" 2>/dev/null || true)"

if [ "$next_commit" = "$current_commit" ]; then
  exit 0
fi

git -C "$repo_dir" checkout -B "$branch" "origin/$branch"

systemctl start sirin-backup.service

rsync -a --delete \
  --exclude='.git/' \
  --exclude='.env' \
  --exclude='data/' \
  --exclude='uploads/' \
  --exclude='backups/' \
  --exclude='.deployed-commit' \
  "$repo_dir/" "$app_dir/"

chmod 750 "$app_dir" "$app_dir/data" "$app_dir/uploads" "$app_dir/backups"
chmod 600 "$app_dir/.env" "$app_dir/data/sirin.db"
chmod 755 "$app_dir/docker-entrypoint.sh" "$app_dir/scripts/"*.sh "$app_dir/deploy/"*.sh

cd "$app_dir"
docker compose --env-file .env build app
docker compose --env-file .env up -d

app_ready=false
for attempt in $(seq 1 60); do
  if curl -fsS http://127.0.0.1:3000/api/crew >/dev/null; then
    app_ready=true
    break
  fi
  sleep 1
done

if [ "$app_ready" != true ]; then
  docker compose --env-file .env ps >&2
  docker compose --env-file .env logs --tail 100 app >&2
  exit 1
fi

docker compose --env-file .env exec -T caddy \
  caddy reload --config /etc/caddy/Caddyfile

printf '%s\n' "$next_commit" > "$app_dir/.deployed-commit"
chmod 600 "$app_dir/.deployed-commit"

docker image prune -f >/dev/null
printf 'Deployed %s at %s\n' "$next_commit" "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
