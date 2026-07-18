import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { serializeAdminReview } from '../../../../src/server/serializers';
import { reviewSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  const id = Number(req.query.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Некорректный ID' });
  }

  try {
    if (req.method === 'PUT') {
      const parsed = reviewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: validationMessage(parsed.error) });
      }
      const data = parsed.data;
      const review = await prisma.review.update({
        where: { id },
        data: {
          text: data.text,
          fullname: data.fullname,
          vacancy: data.vacancy,
          photoImage: data.photoImage || null,
          position: data.position,
          active: data.active,
        },
      });
      return res.status(200).json(serializeAdminReview(review));
    }

    if (req.method === 'DELETE') {
      await prisma.review.delete({ where: { id } });
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['PUT', 'DELETE']);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }
    return apiError(res, error);
  }
});
