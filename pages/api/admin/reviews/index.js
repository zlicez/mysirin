import { withAdmin } from '../../../../src/server/auth';
import { prisma } from '../../../../src/server/db';
import { serializeAdminReview } from '../../../../src/server/serializers';
import { reviewSchema, validationMessage } from '../../../../src/server/validation';
import { apiError, methodNotAllowed } from '../../../../src/server/api';

export default withAdmin(async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const reviews = await prisma.review.findMany({
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
      });
      return res.status(200).json(reviews.map(serializeAdminReview));
    }

    if (req.method === 'POST') {
      const parsed = reviewSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: validationMessage(parsed.error) });
      }

      const lastReview = await prisma.review.findFirst({
        orderBy: [{ position: 'desc' }, { id: 'desc' }],
        select: { position: true },
      });
      const data = parsed.data;
      const review = await prisma.review.create({
        data: {
          text: data.text,
          fullname: data.fullname,
          vacancy: data.vacancy,
          photoImage: data.photoImage || null,
          position: lastReview ? lastReview.position + 1 : 1,
          active: data.active,
        },
      });
      return res.status(201).json(serializeAdminReview(review));
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) {
    return apiError(res, error);
  }
});
