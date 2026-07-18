export function methodNotAllowed(res, methods) {
  res.setHeader('Allow', methods);
  return res.status(405).json({ message: 'Метод не поддерживается' });
}

export function apiError(res, error) {
  console.error(error);
  return res.status(500).json({ message: 'Внутренняя ошибка сервера' });
}
