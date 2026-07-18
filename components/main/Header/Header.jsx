import React from 'react';
// Img
import logo from '../../../public/images/main/header/Logo.png'
// Style
import s from './Header.module.scss'

const Header = () => {
    return (
        <div className={s.header}>
            <img className={s.header__logo} src={logo.src} alt="Логотип" />
            <div className={s.header__info}>
                <h2 className={s.header__title}>сирин</h2>
                <h3 className={s.header__subtitle}>образцовый хореографический ансамбль</h3>
            </div>
        </div>
    );
};

export default Header;