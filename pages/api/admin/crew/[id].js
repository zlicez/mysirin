import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { serializeAdminCrew } from '../../../../src/server/serializers';
import { crewSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Некорректный ID' });
  try {
    if (req.method === 'GET') {
      const member = await prisma.crewMember.findUnique({
        where: { id },
        include: { gallery: { orderBy: { position: 'asc' } } },
      });
      if (!member) return res.status(404).json({ message: 'Участник не найден' });
      return res.status(200).json(serializeAdminCrew(member));
    }
    if (req.method === 'PUT') {
      const parsed = crewSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
      const data = parsed.data;
      const member = await prisma.$transaction(async (tx) => {
        await tx.crewImage.deleteMany({ where: { crewId: id } });
        return tx.crewMember.update({
          where: { id },
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
      });
      return res.status(200).json(serializeAdminCrew(member));
    }
    if (req.method === 'DELETE') {
      await prisma.crewMember.delete({ where: { id } });
      return res.status(204).end();
    }
    return methodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Участник не найден' });
    return apiError(res, error);
  }
});
