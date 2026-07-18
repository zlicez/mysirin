import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

const statuses = new Set(['NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED']);

export default withAdmin(async function handler(req, res) {
  const id = Number(req.query.id);
  const status = String(req.body?.status || '');
  if (!Number.isInteger(id) || (req.method === 'PATCH' && !statuses.has(status))) {
    return res.status(400).json({ message: 'Некорректные данные' });
  }
  try {
    if (req.method === 'DELETE') {
      await prisma.application.delete({ where: { id } });
      return res.status(204).end();
    }
    if (req.method !== 'PATCH') return methodNotAllowed(res, ['PATCH', 'DELETE']);
    const application = await prisma.application.update({ where: { id }, data: { status } });
    return res.status(200).json(application);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Заявка не найдена' });
    return apiError(res, error);
  }
});
