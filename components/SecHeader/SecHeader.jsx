import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

// img
import logo from '../../public/svg/secHeader/sirin.svg'
import textSirin from '../../public/svg/secHeader/textSirin.svg'
// Style
import s from './SecHeader.module.scss'
import Link from 'next/link';

const SecHeader = () => {

    const links = [
        {
            id: 0,
            text: 'Новости',
            href: '/news',
            active: false
        },
        {
            id: 1,
            text: 'КОМАНДА',
            href: '/team',
            active: false
        },
        {
            id: 2,
            text: 'Направления',
            href: '/direction',
            active: false
        },
        {
            id: 3,
            text: 'Расписание',
            href: process.env.NEXT_PUBLIC_SCHEDULE_URL,
            active: false
        },
        {
            id: 4,
            text: 'Контакты',
            href: '/contacts',
            active: false
        },
        {
            id: 5,
            text: 'О нас',
            href: '/about',
            active: false
        },
    ]

    const navigate = useRouter()
    const [thisPage, setThisPage] = useState()
    useEffect(() => {
        setThisPage(Array.from(navigate.route.split('/')))
    }, [navigate])

    const resultLink = links.map(current => {
        if (thisPage) {
            current.href === '/' + thisPage[1] ? current.active = true : current.active = false
        }

        return (
            !current.to ?
                <Link key={current.text} target={current.text === 'Расписание' ? '_blank' : '_parent'} className={[s.SecHeader__link, current.active && s.SecHeader__link_active].join(' ')} href={current.href}>{current.text}</Link>
                :
                <a href={'/#' + current.to} key={current.text} className={[s.SecHeader__link, current.active && s.SecHeader__link_active].join(' ')}>{current.text}</a>
        )
    })

    return (
        <div className={s.SecHeader}>
            <div className={s.SecHeader__wrapper}>
                <Link href='/' className={s.SecHeader__info}>
                    <img className={s.SecHeader__title} src={logo.src} alt="" />
                    <img className={s.SecHeader__subtitle} src={textSirin.src} alt="" />
                </Link>

                <div className={s.SecHeader__nav}>
                    {resultLink}
                </div>
            </div>
        </div>
    );
};

export default SecHeader;
