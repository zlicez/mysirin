import React from 'react';

// Style
import s from './Preview.module.scss'

const Preview = ({ title, titleSpan, textOne, textTwo }) => {
    // title - Основной текст
    // text - текст под title
    // titleSpan - Текст под основным

    return (
        <div className={s.preview}>
            <h2 className={s.preview__title}>
                {title}
                <span>{textOne} <span className={s.preview__title_span}>{titleSpan}</span> {textTwo}</span>
            </h2>
        </div>
    );
};

export default Preview;