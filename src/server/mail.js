import nodemailer from 'nodemailer';

export async function sendApplicationEmail(application) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return { status: 'SKIPPED', error: 'SMTP не настроен' };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.APPLICATION_RECIPIENT || 'ef.sirin@mail.ru',
      subject: `Новая заявка на обучение №${application.id}`,
      text: [
        `Заявитель: ${application.fullnameApplicant}`,
        `Обучающийся: ${application.fullnameStudent}`,
        `Возраст: ${application.ageStudent}`,
        `Контакт: ${application.contact}`,
        `Место обучения: ${application.place}`,
      ].join('\n'),
    });
    return { status: 'SENT', error: null };
  } catch (error) {
    return { status: 'FAILED', error: String(error.message || error).slice(0, 1000) };
  }
}
