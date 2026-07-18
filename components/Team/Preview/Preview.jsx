import React from 'react';

// Style
import s from './Preview.module.scss'

const Preview = ({ title, titleSpan, textOne, textTwo }) => {

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
