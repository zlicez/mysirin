import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { serializeAdminCrew } from '../../../../src/server/serializers';
import { crewSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const crew = await prisma.crewMember.findMany({
        include: { gallery: { orderBy: { position: 'asc' } } },
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
      });
      return res.status(200).json(crew.map(serializeAdminCrew));
    }
    if (req.method === 'POST') {
      const parsed = crewSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
      const data = parsed.data;
      const member = await prisma.crewMember.create({
        data: {
          fullname: data.fullname,
          vacancy: data.vacancy,
          subVacancy: data.subVacancy || null,
          education: data.education || null,
          experience: data.experience || null,
          achievements: data.achievements || null,
          position: data.position,
          photoImage: data.photoImage || null,
          bannerImage: data.bannerImage || null,
          active: data.active,
          gallery: { create: data.gallery.map((filename, position) => ({ filename, position })) },
        },
        include: { gallery: { orderBy: { position: 'asc' } } },
      });
      return res.status(201).json(serializeAdminCrew(member));
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return apiError(res, error);
  }
});
