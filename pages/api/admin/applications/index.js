import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const status = String(req.query.status || 'ALL');
    const where = status === 'ALL' ? {} : { status };
    const applications = await prisma.application.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 500,
    });
    return res.status(200).json(applications);
  } catch (error) {
    return apiError(res, error);
  }
});
