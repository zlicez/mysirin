import React from 'react';
import CustomButton from '../../CustomButton/CustomButton';

// Style
import s from './Rules.module.scss'
import Link from 'next/link';

const Rules = () => {
    return (
        <div className={s.rules}>
            <h2 className={s.rules__title}>ПРАВИЛА АНСАМБЛЯ</h2>
            <h3 className={s.rules__subtitle}>В нашем коллективе существует ряд общепринятых и важных правил</h3>
            <div className={s.rules__button}>
                <Link target='_blank' href={'/ustav.pdf'}>
                    <CustomButton text='ОЗНАКОМИТЬСЯ' />
                </Link>
            </div>
        </div>
    );
};

export default Rules;