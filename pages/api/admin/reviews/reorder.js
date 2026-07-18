import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  if (req.method !== 'PUT') return methodNotAllowed(res, ['PUT']);

  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : [];
  if (!ids.length || ids.some((id) => !Number.isInteger(id)) || new Set(ids).size !== ids.length) {
    return res.status(400).json({ message: 'Некорректный порядок отзывов' });
  }

  try {
    const existing = await prisma.review.findMany({ select: { id: true } });
    const existingIds = new Set(existing.map((review) => review.id));
    if (ids.length !== existing.length || ids.some((id) => !existingIds.has(id))) {
      return res.status(400).json({ message: 'Список отзывов изменился. Обновите страницу.' });
    }

    await prisma.$transaction(
      ids.map((id, index) => prisma.review.update({
        where: { id },
        data: { position: index + 1 },
      }))
    );
    return res.status(200).json({ ok: true });
  } catch (error) {
    return apiError(res, error);
  }
});
