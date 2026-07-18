#!/bin/sh
set -eu

APP_DIR="${APP_DIR:-/opt/sirin}"
BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
cd "$APP_DIR"

response_file="$(mktemp)"
cookie_file="$(mktemp)"
login_file="$(mktemp)"
trap 'rm -f "$response_file" "$cookie_file" "$login_file"' EXIT

for path in "/" "/admin/login" "/api/news?count=2&start=1" "/api/crew" "/api/contacts"; do
  code="$(curl -sS -o "$response_file" -w '%{http_code}' "$BASE_URL$path")"
  bytes="$(wc -c "$response_file" | awk '{print $1}')"
  printf '%s HTTP=%s BYTES=%s\n' "$path" "$code" "$bytes"
  test "$code" = "200"
done

set -a
. ./.env
set +a
login_payload="$(printf '{"email":"%s","password":"%s"}' "$ADMIN_EMAIL" "$ADMIN_PASSWORD")"
curl -sS -c "$cookie_file" -H 'Content-Type: application/json' \
  -d "$login_payload" "$BASE_URL/api/admin/login" > "$login_file"
session="$(curl -sS -b "$cookie_file" "$BASE_URL/api/admin/session")"
printf 'ADMIN_SESSION=%s\n' "$session"
printf '%s' "$session" | grep -q "\"email\":\"$ADMIN_EMAIL\""

media="$(find uploads -type f ! -name .gitkeep | head -n 1)"
filename="$(basename "$media")"
curl -sS -o /dev/null \
  -w "/api/media/$filename HTTP=%{http_code} BYTES=%{size_download}\n" \
  "$BASE_URL/api/media/$filename"
