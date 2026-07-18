import Link from 'next/link';
import React from 'react';

// Carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
// img
import img1 from '../../../public/images/main/preview/background-1.webp';
// Style
import s from './Preview.module.scss';

const Preview = ({ slides = [] }) => {
  const link = [
    {
      id: 0,
      text: 'Новости',
      link: '/news',
    },
    {
      id: 1,
      text: 'КОМАНДА',
      link: '/team',
    },
    {
      id: 2,
      text: 'Направления',
      link: '/direction',
    },
    {
      id: 3,
      text: 'Расписание',
      link: process.env.NEXT_PUBLIC_SCHEDULE_URL,
    },
    {
      id: 4,
      text: 'Контакты',
      link: '/contacts',
    },
    {
      id: 5,
      text: 'О нас',
      link: '/about',
    },
  ];

  const resultLink = link.map((current) => {
    return (
      <a
        key={current.text}
        target={current.text === 'Расписание' ? '_blank' : '_parent'}
        className={s.preview__link}
        href={current.link}
      >
        {current.text}
      </a>
    );
  });

  const dataImg = slides.length
    ? slides.map((slide) => ({
        id: slide.id,
        text: slide.alt || `Слайд ${slide.id}`,
        src: `${process.env.NEXT_PUBLIC_STATIC_URL}${slide.image}`,
      }))
    : [{ id: 0, text: 'Ансамбль «Сирин»', src: img1.src }];

  const resultImg = dataImg.map((current) => {
    return (
      <img
        key={current.text}
        className={s.preview__img}
        src={current.src}
        alt={current.text}
      />
    );
  });

  return (
    // style={{minHeight:`${widthImg} px`}}
    <div className={s.preview}>
      <div className={s.preview__menu}>{resultLink}</div>
      <div className={s.preview__info}>
        <h2 className={s.preview__title}>
          Ансамбль является Лауреатом <pre />
          Международных и Всеросcийских фестивалей
        </h2>
        <Link href={{ hash: '#about' }} className={s.preview__button}>
          ПОДРОБНЕЕ
        </Link>
      </div>

      {/* Рабочий вариант, только точки немного поднять */}
      <div className={s.slider}>
        <Carousel
          // Эмуляция пальца по экрану
          emulateTouch={true}
          // Скрывает стрелки
          showArrows={false}
          // Бесконечная крутилка
          infiniteLoop={true}
          // Убрать статус какая фотография
          showStatus={false}
          // Убрать вывод фоток слева снизу
          showThumbs={false}
          // Автоматическое прокручивание раз в 5с
          autoPlay={true}
          interval={5000}
          // Время на прокрутку в 1с
          transitionTime={500}
        >
          {resultImg}
        </Carousel>
      </div>
    </div>
  );
};

export default Preview;
