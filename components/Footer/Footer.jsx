import React from 'react';

// img
import vk from '../../public/svg/footer/vk.svg';
import facebook from '../../public/svg/footer/facebook.svg';
import telegram from '../../public/svg/footer/telegram.svg';
import youtube from '../../public/svg/footer/youtube.svg';
import instagram from '../../public/svg/footer/instagram.svg';
// Style
import s from './Footer.module.scss';

// Пока тестовая версия
import { useFetchContactQuery } from '../../src/contacts/contacts';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data, error } = useFetchContactQuery();
  let phones;

  if (error) {
    console.error(error);
  } else {
    phones =
      data &&
      data.map((current) => {
        return (
          current.type === 'phone' && (
            <a
              key={current.id}
              className={s.footer__text}
              href={`tel: ${current.data}`}
            >
              {current.data}
            </a>
          )
        );
      });
  }

  const links = [
    {
      id: 0,
      text: 'о нас',
      href: '/about',
    },
    {
      id: 1,
      text: 'ПЕДАГОГИ',
      href: '/team',
    },
    {
      id: 2,
      text: 'НАПРАВЛЕНИЯ',
      href: '/direction',
    },
    {
      id: 3,
      text: 'Расписание',
      href: process.env.NEXT_PUBLIC_SCHEDULE_URL,
    },
    {
      id: 4,
      text: 'Контакты',
      href: '/contacts',
    },
    {
      id: 5,
      text: 'Устав Сирин',
      href: '/ustav.pdf',
    },
  ];

  const resultLinks = links.map((current) => {
    return (
      <a
        key={current.id}
        href={current.href}
        target={
          current.text === 'Расписание' || current.text === 'Устав Сирин'
            ? '_blank'
            : '_parent'
        }
        className={s.footer__link}
      >
        {current.text}
      </a>
    );
  });

  const imgs = [
    {
      id: 0,
      img: vk,
      href: 'https://vk.com/sirin.moscow',
    },
    // {
    //     id: 1,
    //     img: facebook,
    //     href: 'https://www.facebook.com.vn'
    // },
    {
      id: 2,
      img: telegram,
      href: 'https://t.me/we_are_sirin',
    },
    {
      id: 3,
      img: youtube,
      href: 'https://youtube.com/@Sirin_Moscow',
    },
    {
      id: 4,
      img: instagram,
      href: 'https://instagram.com/we_are_sirin',
    },
  ];

  const resultImg = imgs.map((current) => {
    return (
      <a key={current.id} href={current.href} target='blank' className={s.icon}>
        <img loading='lazy' className={s.icon__link} src={current.img.src} alt='Иконка' />
      </a>
    );
  });

  return (
    <div className={s.footer}>
      <div className={s.footer__wrapper}>
        <div className={s.footer__info}>
          <div className={s.footer__navigation}>{resultLinks}</div>

          <div className={s.footer__contact}>
            <div className={s.footer__list}>
              <div className={s.footer__item}>
                <h2 className={s.footer__text + ' ' + s.footer__text_adress}>
                  ул. Земляной Вал, д.27, стр.3, метро Курская
                </h2>
                <h2 className={s.footer__text + ' ' + s.footer__text_adress}>
                  ул. Чечулина д.10, ГБУ ЦКС «Южное Измайлово»
                </h2>
                <h2 className={s.footer__text + ' ' + s.footer__text_adress}>
                  ул. Первомайская д.93, Место Встречи Первомайский
                </h2>
              </div>
              <div className={s.footer__item}>
                <h2 className={s.footer__title}>номера для связи</h2>
                {phones}
              </div>
            </div>
            <div className={s.footer__icon}>{resultImg}</div>
          </div>
        </div>
        <div className={s.footer__root}>
          <span>
            <p>Ансамбль «Сирин», © 2011—{currentYear}.</p>
            Все права защищены
          </span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
