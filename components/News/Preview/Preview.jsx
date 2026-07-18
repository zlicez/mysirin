import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import React from 'react';

import error from '../../../public/images/news/errorNewsBig.png'

// Style
import s from './Preview.module.scss'

const Preview = ({ previewNews }) => {
    if (!previewNews) {
        return <></>
    }

    return (
        <div className={s.preview}>
            <img className={s.preview__img} src={previewNews?.pre_images[0]?.filename ? process.env.NEXT_PUBLIC_STATIC_URL + previewNews.pre_images[0].filename : error.src} alt="Картинка" />
            <div className={s.preview__info}>
                <h2 className={s.preview__date}>{format(new Date(previewNews?.createdAt), 'P', { locale: ru })}</h2>
                <h2 className={s.preview__text}>{previewNews?.title}</h2>
                <Link href={`/news/${previewNews?.id}`} className={s.preview__button}>ПОДРОБНЕЕ</Link>
            </div>
        </div>
    );
};

export default Preview;
