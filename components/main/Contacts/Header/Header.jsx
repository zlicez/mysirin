import React from 'react';

// Кнопка
import CustomButton from '../../../CustomButton/CustomButton';
// Style
import s from './Header.module.scss'
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {

    const route = useRouter()

    return (
        <div className={s.header}>
            <h2 className={s.header__title}>ЗАПИШИСЬ НА КУРСЫ</h2>
            <p className={s.header__subtitle}>Запишитесь на курсы и реализуйте свой творческий потенциал!</p>
            <Link scroll={false} href={{ query: { form: 'open' } }} className={s.header__button} >
                <CustomButton text='ПОДАТЬ ЗАЯВКУ' />
            </Link>
        </div>
    );
};

export default Header;