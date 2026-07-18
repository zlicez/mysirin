import React, { useEffect, useRef, useState } from 'react';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';

// Style
import s from './Slider.module.scss'
import classNames from 'classnames';

const Slider = ({ currentNews }) => {

    const [windowSize, setWindowSize] = useState(1920)

    const swiperRef = useRef()

    // Для отступа у слайдера
    const [windowWidth, setWindowWidth] = useState(0)

    useEffect(() => {
        windowScreen && windowScreen()

        if (window) {
            setWindowSize(window.innerWidth)
        }
    }, [])

    const images = currentNews?.images || []

    if (images.length <= 0) {
        return (
            <div className={s.slider}>
            </div>
        )
    }

    function windowScreen() {
        if (window.screen.width < 1920 && window.screen.width > 1420) {
            setWindowWidth(30)
        }
        else if (window.screen.width < 1420 && window.screen.width > 1024) {
            setWindowWidth(23)
        }
        else if (window.screen.width < 1024 && window.screen.width > 768) {
            setWindowWidth(15)
        }
        else if (window.screen.width < 768 && window.screen.width > 420) {
            setWindowWidth(17)
        }
        else {
            setWindowWidth(13)
        }
    }

    const resultData = images.map(current => {
        return (
            <SwiperSlide key={current.filename} className={s.slider__slide}>
                <img className={s.slider__img} src={process.env.NEXT_PUBLIC_STATIC_URL + current.filename} alt="Картинка" />
            </SwiperSlide>
        )
    })

    return (
        <div className={classNames(s.slider, {
            [s.slider__more]: images.length > 1
        })}>
            <button onClick={() => swiperRef.current.slidePrev()} className={classNames(s.slider__button, {
                [s.slider__button_none]: images.length <= 1
            })} >
                <svg width="20" height="35" viewBox="0 0 20 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.0208 0L0 17.0208L17.6777 34.6985L19.799 32.5772L4.24264 17.0208L19.1422 2.12132L17.0208 0Z" fill="black" />
                </svg>
            </button>
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                slidesPerView={images.length <= 1 ? 1 : 2}
                spaceBetween={windowWidth}
                centeredSlides={windowSize < 600 ? true : false}
                className={s.slider__swiper}
            >
                {resultData}
            </Swiper>
            <button onClick={() => swiperRef.current.slideNext()} className={classNames(s.slider__button, {
                [s.slider__button_none]: images.length <= 1
            })}>
                <svg width="21" height="35" viewBox="0 0 21 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.57698 34.6985L20.5978 17.6777L2.92015 0L0.798828 2.12132L16.3552 17.6777L1.45566 32.5772L3.57698 34.6985Z" fill="black" />
                </svg>
            </button>
        </div>
    );
};

export default Slider;
