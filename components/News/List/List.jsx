import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import React from 'react';

import error from '../../../public/images/news/errorNewsMini.png';

// Style
import s from './List.module.scss';

const List = ({ news, previewNews }) => {
  if (!news) {
    return <></>;
  }

  const resultData = news?.map((current) => {
    return (
      <Link key={current.id} href={`/news/${current.id}`} className={s.item}>
        <img
          className={s.item__img}
          src={
            current.pre_images[0]?.filename
              ? process.env.NEXT_PUBLIC_STATIC_URL +
                current.pre_images[0].filename
              : error.src
          }
          alt='Картинка'
        />
        <p className={s.item__date}>
          {current.createdAt &&
            format(new Date(current.createdAt), 'P', { locale: ru })}
        </p>
        <h2 className={s.item__text}>{current?.title}</h2>
      </Link>
    );
  });

  return (
    <div className={s.wrapper}>
      <div className={s.info}>
        <h2 className={s.info__date}>
          {previewNews?.createdAt &&
            format(new Date(previewNews?.createdAt), 'P', { locale: ru })}
        </h2>
        <p className={s.info__text}>{previewNews?.title}</p>
        <Link href={`/news/${previewNews?.id}`} className={s.info__button}>
          Подробнее
        </Link>
      </div>

      <div className={s.list}>{resultData}</div>
    </div>
  );
};

export default List;
