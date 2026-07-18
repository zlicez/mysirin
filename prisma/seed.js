const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const crew = [
  ['Давыдова Ирина Сергеевна', 'Художественный руководитель и основатель Ведущего хореографического ансамбля СИРИН'],
  ['Фокина Екатерина Сергеевна', 'Директор ансамбля'],
  ['Анисимов Артем Алексеевич', 'Преподаватель мужского класса'],
  ['Давыдов Артём Максимович', 'Педагог ансамбля по ритмике. Звукорежиссёр ансамбля.'],
  ['Терентьева Валентина Валерьевна', 'Педагог ансамбля по хореографии'],
  ['Брунова Полина Олеговна', 'Педагог ансамбля по хореографии'],
  ['Автухова Татьяна Викторовна', 'Педагог ансамбля по акробатике'],
  ['Давыдов Вадим Максимович', 'Преподаватель ансамбля по мужскому классу'],
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@mysirin.local').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  });

  if ((await prisma.contact.count()) === 0) {
    await prisma.contact.createMany({
      data: [
        { type: 'phone', data: '+7 (967) 042-21-04', position: 1 },
        { type: 'phone', data: '+7 (917) 595-12-88', position: 2 },
        { type: 'email', data: 'ef.sirin@mail.ru', position: 1 },
      ],
    });
  }

  if ((await prisma.crewMember.count()) === 0) {
    await prisma.crewMember.createMany({
      data: crew.map(([fullname, vacancy], index) => ({
        fullname,
        vacancy,
        position: index + 1,
      })),
    });
  }

  if ((await prisma.review.count()) === 0) {
    await prisma.review.create({
      data: {
        text: 'Вот уже четвёртый год с Вами. За это время мы очень сильно всех полюбили. С нетерпением ждём очередных занятий!',
        fullname: 'Елена Батманова',
        vacancy: 'Ученица ансамбля',
        position: 1,
      },
    });
  }

  await prisma.homeSetting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  if ((await prisma.homeSlide.count()) === 0) {
    await prisma.homeSlide.create({
      data: {
        image: 'images/main/preview/background-1.webp',
        alt: 'Ансамбль «Сирин»',
        position: 1,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
