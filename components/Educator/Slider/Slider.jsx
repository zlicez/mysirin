import React, { useRef } from 'react';

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import Link from 'next/link';
// Style
import s from './Slider.module.scss'
// Component
import CustomButton from '../../CustomButton/CustomButton'

const Slider = ({ images }) => {
    const swiperRef = useRef()
    if (images.length <= 0) {
        return <></>
    }

    const resultData = images && images.map(current => {
        return (
            <SwiperSlide key={current.id} className={s.slider__slide}>
                <Link className={s.slider__img} href={process.env.NEXT_PUBLIC_STATIC_URL + current.filename} target='_blank'>
                    <img width={600} height={338} className={s.slider__img} src={process.env.NEXT_PUBLIC_STATIC_URL + current.filename} alt="Картинка" />
                </Link>
            </SwiperSlide >
        )
    })

    return (
        <div className={s.slider}>
            <div className={s.slider__wrapper}>
                <button onClick={() => swiperRef.current.slidePrev()} className={s.slider__button}>
                    <svg width="20" height="36" viewBox="0 0 20 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M17.0208 0.650635L0 17.6715L17.6777 35.3491L19.799 33.2278L4.24264 17.6715L19.1422 2.77196L17.0208 0.650635Z" fill="black" />
                    </svg>
                </button>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                    breakpoints={{
                        800: { centeredSlides: false, spaceBetween: 30, slidesPerView: 2 },
                    }}
                    centeredSlides={true}
                    slidesPerView={1}
                    spaceBetween={15}
                    pagination={{
                        clickable: true,
                    }}
                    className={s.slider__swiper}
                >
                    {resultData}
                </Swiper>
                <button onClick={() => swiperRef.current.slideNext()} className={s.slider__button}>
                    <svg width="21" height="36" viewBox="0 0 21 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.57698 35.3491L20.5978 18.3283L2.92015 0.650635L0.798828 2.77196L16.3552 18.3283L1.45566 33.2278L3.57698 35.3491Z" fill="black" />
                    </svg>
                </button>
            </div>
            <div className={s.slider__back}>
                <Link className={s.slider__link} href="/team">
                    <CustomButton text='вся команда' />
                </Link>
            </div>
        </div>
    );
};

export default Slider;
