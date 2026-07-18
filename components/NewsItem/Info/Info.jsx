import React from 'react';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import error from '../../../public/images/news/errorNewsBig.png'

// Style
import s from './Info.module.scss'

const Info = ({ currentNews }) => {
    return (
        <div className={s.info}>
            <div className={s.info__header}>
                <h2 className={s.info__title}>{currentNews?.title}</h2>
                <p className={s.info__date}>{currentNews && format(new Date(currentNews?.createdAt), 'P', { locale: ru })}</p>
            </div>
            <img className={s.info__img} src={currentNews?.pre_images[0]?.filename ? process.env.NEXT_PUBLIC_STATIC_URL + currentNews.pre_images[0].filename : error.src} alt="картинка" />
            <div className={s.info__list}>
                <div className={s.info__text} dangerouslySetInnerHTML={{ __html: currentNews?.text || '' }} />
            </div>
        </div>
    );
};

export default Info;
