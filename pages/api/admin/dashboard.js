import { withAdmin } from '../../../src/server/auth';
import { prisma } from '../../../src/server/db';
import { apiError, methodNotAllowed } from '../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const [news, crew, reviews, applications, newApplications, slides] = await Promise.all([
      prisma.news.count(),
      prisma.crewMember.count(),
      prisma.review.count(),
      prisma.application.count(),
      prisma.application.count({ where: { status: 'NEW' } }),
      prisma.homeSlide.count(),
    ]);
    return res.status(200).json({ news, crew, reviews, applications, newApplications, slides });
  } catch (error) {
    return apiError(res, error);
  }
});
