import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { slideSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) return res.status(400).json({ message: 'Некорректный ID' });
  try {
    if (req.method === 'PUT') {
      const parsed = slideSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
      const slide = await prisma.homeSlide.update({ where: { id }, data: parsed.data });
      return res.status(200).json(slide);
    }
    if (req.method === 'DELETE') {
      await prisma.homeSlide.delete({ where: { id } });
      return res.status(204).end();
    }
    return methodNotAllowed(res, ['PUT', 'DELETE']);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Слайд не найден' });
    return apiError(res, error);
  }
});
