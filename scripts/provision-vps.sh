#!/bin/sh
set -eu

APP_DIR="${APP_DIR:-/opt/sirin}"
cd "$APP_DIR"

if [ -f .env ]; then
  echo "Production .env already exists; keeping current secrets."
  exit 0
fi

umask 077
auth_secret="$(openssl rand -hex 32)"
admin_password="$(openssl rand -hex 16)"

cat > .env <<EOF
DATABASE_URL="file:/app/data/sirin.db"
NEXT_PUBLIC_API_URL="/api/"
NEXT_PUBLIC_STATIC_URL="/"
INTERNAL_API_URL="http://127.0.0.1:3000/api/"
NEXT_PUBLIC_SCHEDULE_URL="https://docs.google.com/spreadsheets/d/19EQ1S-SoZ9tk2GAKtlyb60SiH9m6mh8YlRj-iQBg8kc"
AUTH_SECRET="$auth_secret"
COOKIE_SECURE="auto"
ADMIN_EMAIL="ef.sirin@mail.ru"
ADMIN_PASSWORD="$admin_password"
APPLICATION_RECIPIENT="ef.sirin@mail.ru"
SMTP_HOST=""
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER=""
SMTP_PASSWORD=""
MAX_UPLOAD_MB="12"
EOF

chmod 600 .env
printf 'GENERATED_ADMIN_EMAIL=%s\n' 'ef.sirin@mail.ru'
printf 'GENERATED_ADMIN_PASSWORD=%s\n' "$admin_password"
