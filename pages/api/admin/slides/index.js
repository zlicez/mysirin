import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { slideSchema, validationMessage } from '../../../../src/server/validation';
import { serializeAdminSlide } from '../../../../src/server/serializers';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const slides = await prisma.homeSlide.findMany({ orderBy: [{ position: 'asc' }, { id: 'asc' }] });
      return res.status(200).json(slides.map(serializeAdminSlide));
    }
    if (req.method === 'POST') {
      const parsed = slideSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });
      const slide = await prisma.homeSlide.create({ data: parsed.data });
      return res.status(201).json(serializeAdminSlide(slide));
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return apiError(res, error);
  }
});
