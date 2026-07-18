import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
// Style
import s from './AllNews.module.scss'
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';

import error from '../../../public/images/news/errorNewsMini.png'

const AllNews = ({ allNews }) => {
    const swiperRef = useRef()
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        windowScreen()
    }, [])

    if (allNews.data.length <= 0) {
        return (
            <>
            </>
        )
    }

    const resultData = allNews && allNews.data?.map(current => {
        return (
            <SwiperSlide className={s.allNews__slide} key={current.id}>
                <Link href={`/news/${current.id}`}>
                    <img className={s.allNews__img} src={current?.pre_images[0]?.filename ? process.env.NEXT_PUBLIC_STATIC_URL + current.pre_images[0].filename : error.src} alt="Картинка" />
                    <p className={s.allNews__date}>{current && format(new Date(current.createdAt), 'P', { locale: ru })}</p>
                    <h2 className={s.allNews__text}>{current.title}</h2>
                </Link>
            </SwiperSlide >
        )
    })

    const windowScreen = () => {
        if (window.screen.width < 1421 && window.screen.width > 1024) {
            setWindowWidth(57)
        }
        else {
            setWindowWidth(27)
        }
    }


    return (
        <div className={s.allNews}>
            <h2 className={s.allNews__title}>другие новости</h2>
            <div className={s.allNews__info}>
                <button onClick={() => swiperRef.current.slidePrev()} className={s.allNews__button}>
                    <svg width="20" height="35" viewBox="0 0 20 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.0208 0L0 17.0208L17.6777 34.6985L19.799 32.5772L4.24264 17.0208L19.1422 2.12132L17.0208 0Z" fill="black" />
                    </svg>
                </button>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                    slidesPerView={'auto'}
                    spaceBetween={windowWidth}
                    pagination={{
                        clickable: true,
                    }}
                    loop
                    className={s.allNews__swiper}
                >
                    {resultData}
                </Swiper>
                <button onClick={() => swiperRef.current.slideNext()} className={s.allNews__button}>
                    <svg width="21" height="35" viewBox="0 0 21 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.57698 34.6985L20.5978 17.6777L2.92015 0L0.798828 2.12132L16.3552 17.6777L1.45566 32.5772L3.57698 34.6985Z" fill="black" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AllNews;