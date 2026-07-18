import React from 'react';
import Link from 'next/link';

// Components
import CustomButton from '../../CustomButton/CustomButton';

import errorImg from '../../../public/images/team/errorTeamMini.png'

// Style
import s from './Team.module.scss'

const Team = ({ team, error }) => {
    const teachers = team && team.map(i => i).sort((a, b) => a.position - b.position)?.slice(0, 6)

    const resultTeachers = teachers && teachers?.map((current, index) => {
        let removePatronymic = (current.fullname).split(' ').slice(0, 2).join(' ')
        return (
            <Link href={`/team/${current.id}`} key={current.id} className={[s.teachers, index === 0 ? s.teachers_first : '', index === 5 ? s.teachers_last : ''].join(' ')}>
                <img loading="lazy" className={s.teachers__img} src={current?.photo[0]?.filename ? process.env.NEXT_PUBLIC_STATIC_URL + current.photo[0].filename : errorImg.src} alt="" />
                <h2 className={s.teachers__name}>{removePatronymic}</h2>
            </Link>
        )
    })

    return (
        <div className={s.team}>
            <div className={s.team__info}>
                <header className={s.team__header}>
                    <h2 className={s.team__title}>НАША КОМАНДА</h2>
                    <p className={s.team__subtitle}>Каждый из нас — талантливый педагог и признанный эксперт в своей области</p>
                    <Link href='/team' className={s.team__button}>
                        <CustomButton text='УЗНАТЬ ЛУЧШЕ' />
                    </Link>
                </header>
                {
                    error ?
                        console.error(error.status)
                        :
                        <div className={s.team__list}>
                            {resultTeachers}
                        </div>
                }
            </div>
        </div>
    );
};

export default Team;
