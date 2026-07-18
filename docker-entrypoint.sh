#!/bin/sh
set -eu

npm run security:check
npx prisma migrate deploy
npx prisma db seed
exec npm start
