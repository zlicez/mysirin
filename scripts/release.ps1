$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if ((git branch --show-current) -ne 'dev') {
  throw 'Release must be started from the dev branch.'
}

if (git status --porcelain) {
  throw 'Commit or discard local changes before releasing.'
}

git fetch origin
git pull --ff-only origin dev

npm test
$env:NEXT_PUBLIC_API_URL = '/api/'
$env:NEXT_PUBLIC_STATIC_URL = '/'
$env:INTERNAL_API_URL = 'http://127.0.0.1:3000/api/'
npm run build

try {
  git switch master
  git pull --ff-only origin master
  git merge --ff-only dev
  git push origin master
} finally {
  git switch dev
}

Write-Host 'master was pushed. The VPS will deploy it automatically in about one minute.'
