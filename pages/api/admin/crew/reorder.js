import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  if (req.method !== 'PUT') return methodNotAllowed(res, ['PUT']);
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : [];
  if (!ids.length || ids.some((id) => !Number.isInteger(id))) {
    return res.status(400).json({ message: 'Некорректный порядок' });
  }
  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.crewMember.update({ where: { id }, data: { position: index + 1 } }))
    );
    return res.status(200).json({ ok: true });
  } catch (error) {
    return apiError(res, error);
  }
});
