import React from 'react';

// Style
import s from './Error.module.scss'

const Error = () => {
    return (
        <div className={s.error}>
            <div className={s.error__info}>
                <h2 className={s.error__title}><span className={s.error__title_span}>404</span>ошибка</h2>
                <p className={s.error__text}>Страница не найдена</p>
            </div>
        </div>
    );
};

export default Error;