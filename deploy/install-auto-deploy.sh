#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  printf 'Run this installer as root.\n' >&2
  exit 1
fi

repo_url="${SIRIN_REPO_URL:-https://github.com/zlicez/mysirin.git}"
repo_dir="${SIRIN_REPO_DIR:-/opt/sirin-repo}"
app_dir="${SIRIN_APP_DIR:-/opt/sirin}"
branch="${SIRIN_DEPLOY_BRANCH:-master}"

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y git rsync

if [ -d "$repo_dir/.git" ]; then
  git -C "$repo_dir" fetch --prune origin "$branch"
  git -C "$repo_dir" checkout -B "$branch" "origin/$branch"
else
  git clone --filter=blob:none --branch "$branch" "$repo_url" "$repo_dir"
fi

install -m 0755 "$repo_dir/deploy/deploy-master.sh" \
  /usr/local/sbin/deploy-sirin-master
install -m 0644 "$repo_dir/deploy/sirin-deploy.service" \
  /etc/systemd/system/sirin-deploy.service
install -m 0644 "$repo_dir/deploy/sirin-deploy.timer" \
  /etc/systemd/system/sirin-deploy.timer

git -C "$repo_dir" rev-parse "origin/$branch" > "$app_dir/.deployed-commit"
chmod 600 "$app_dir/.deployed-commit"

systemctl daemon-reload
systemctl enable --now sirin-deploy.timer
systemctl status sirin-deploy.timer --no-pager
