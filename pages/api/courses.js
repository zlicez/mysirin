import { prisma } from '../../src/server/db';
import { applicationSchema, validationMessage } from '../../src/server/validation';
import { sendApplicationEmail } from '../../src/server/mail';
import { apiError, methodNotAllowed } from '../../src/server/api';

export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: validationMessage(parsed.error) });

  try {
    const data = parsed.data;
    const application = await prisma.application.create({
      data: {
        fullnameApplicant: data.fullname_applicant,
        fullnameStudent: data.fullname_student,
        ageStudent: data.age_student,
        contact: data.contact,
        place: data.place,
      },
    });

    const delivery = await sendApplicationEmail(application);
    await prisma.application.update({
      where: { id: application.id },
      data: { emailStatus: delivery.status, emailError: delivery.error },
    });

    return res.status(201).json({ id: application.id, message: 'Заявка принята' });
  } catch (error) {
    return apiError(res, error);
  }
}
