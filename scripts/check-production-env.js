const failures = [];

if (
  !process.env.AUTH_SECRET ||
  process.env.AUTH_SECRET.length < 32 ||
  process.env.AUTH_SECRET.includes('local-development')
) {
  failures.push('AUTH_SECRET должен быть новым случайным значением длиной не менее 32 символов');
}

if (
  !process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD.length < 12 ||
  process.env.ADMIN_PASSWORD === 'ChangeMe123!'
) {
  failures.push('ADMIN_PASSWORD должен быть заменён и содержать не менее 12 символов');
}

if (!['true', 'auto'].includes(process.env.COOKIE_SECURE)) {
  failures.push('COOKIE_SECURE должен быть true или auto');
}

if (
  process.env.NEXT_PUBLIC_API_URL !== '/api/' &&
  !process.env.NEXT_PUBLIC_API_URL?.startsWith('https://')
) {
  failures.push('NEXT_PUBLIC_API_URL должен быть /api/ или HTTPS-адресом сайта');
}

if (
  process.env.NEXT_PUBLIC_STATIC_URL !== '/' &&
  !process.env.NEXT_PUBLIC_STATIC_URL?.startsWith('https://')
) {
  failures.push('NEXT_PUBLIC_STATIC_URL должен быть / или HTTPS-адресом сайта');
}

if (failures.length) {
  console.error(`Конфигурация production не готова:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log('Production-конфигурация прошла проверку.');
