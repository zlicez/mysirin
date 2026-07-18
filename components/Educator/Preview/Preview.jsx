import React from 'react';

import error from '../../../public/images/team/errorTeamMini.png'
// Style
import s from './Preview.module.scss'

const Preview = ({ personInfo }) => {
    return (
        <div className={s.preview} style={{ backgroundImage: personInfo?.banner[0]?.filename && `url(${process.env.NEXT_PUBLIC_STATIC_URL + personInfo?.banner[0]?.filename})` }}>
            <div className={s.preview__info}>
                {
                    personInfo ?
                        <>
                            <img className={s.preview__img} src={personInfo?.photo[0]?.filename ? process.env.NEXT_PUBLIC_STATIC_URL + personInfo.photo[0].filename : error.src} alt="" />
                            <h2 className={s.preview__title}>{personInfo.fullname}</h2>
                            <p className={s.preview__text}>
                                <span className={s.preview__text}>{personInfo.vacancy}</span>
                                <span className={s.preview__text}>{personInfo.sub_vacancy}</span>
                            </p>
                        </>
                        :
                        <h2>Загрузка...</h2>
                }
            </div>
        </div>
    );
};

export default Preview;