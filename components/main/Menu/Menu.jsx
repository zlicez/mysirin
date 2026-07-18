import React from 'react';

// Style
import s from './Menu.module.scss'

const Menu = () => {

    const link = [
        {
            id: 0,
            text: 'Новости',
            link: '/news'
        },
        {
            id: 1,
            text: 'КОМАНДА',
            link: '/team'
        },
        {
            id: 2,
            text: 'Направления',
            link: '/direction'
        },
        {
            id: 3,
            text: 'Контакты',
            link: '/contacts'
        },
        {
            id: 4,
            text: 'Расписание',
            link: process.env.NEXT_PUBLIC_SCHEDULE_URL
        },
        {
            id: 5,
            text: 'О нас',
            link: '/about'
        },
    ]

    const resultLink = link.map(current => {
        return (
            <a key={current.text} target={current.text === 'Расписание' ? '_blank' : '_parent'} className={s.menu__link} href={current.link}>{current.text}</a>
        )
    })


    return (
        <div className={s.menu}>
            {resultLink}
        </div>
    );
};

export default Menu;
