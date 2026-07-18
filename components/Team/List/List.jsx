import React from 'react';
import Link from 'next/link';

// components
import CustomButton from '../../CustomButton/CustomButton'
// Style
import s from './List.module.scss'

import error from '../../../public/images/team/errorTeamMini.png'

const List = ({ data, text }) => {
    const dataSort = data.map(i => i).sort((a, b) => a.position - b.position)
    const resultData = dataSort?.map(current => {
        return (
            <div key={current.id} className={s.item}>
                <img className={s.item__img} src={current?.photo[0]?.filename ? process.env.NEXT_PUBLIC_STATIC_URL + current.photo[0].filename : error.src} />
                <div className={s.item__info}>
                    <h2 className={s.item__title}>{current.fullname}</h2>
                    <h3 className={s.item__subtitle}>{current.vacancy}</h3>
                    <Link href={`/team/${current.id}`} className={s.item__button}>
                        <CustomButton text={text} />
                    </Link>
                </div>
            </div>
        )
    })

    return (
        <div className={s.list}>
            {resultData}
        </div>
    );
};

export default List;