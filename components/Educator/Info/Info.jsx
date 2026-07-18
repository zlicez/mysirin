import React from 'react';

import error from '../../../public/images/team/errorTeamMini.png';

// Style
import s from './Info.module.scss';

const Info = ({ personInfo }) => {
  const achievements = personInfo?.achievements;
  const education = personInfo?.education;

  return (
    <div className={s.wrapper}>
      <div className={s.person}>
        <div className={s.person__info}>
          <img
            className={s.person__img}
            src={
              personInfo?.photo[0]?.filename
                ? process.env.NEXT_PUBLIC_STATIC_URL +
                  personInfo.photo[0].filename
                : error.src
            }
            alt='фотография'
          />
          <h2 className={s.person__title}>{personInfo?.fullname}</h2>
        </div>
        <p className={s.person__text}>
          <span className={s.person__text}>{personInfo?.vacancy}</span>
          <span className={s.person__text}>{personInfo?.sub_vacancy}</span>
        </p>
      </div>

      <div className={s.info}>
        <div className={s.info__item}>
          <h2 className={s.info__title}>ОБРАЗОВАНИЕ</h2>
          <p className={s.info__text}>{education}</p>
        </div>
        <div className={s.info__item}>
          <h2 className={s.info__title}>СТАЖ РАБОТЫ</h2>
          <p className={s.info__text}>{personInfo?.experience}</p>
        </div>
        {personInfo?.achievements && (
          <div className={s.info__item}>
            <h2 className={s.info__title}>ДОСТИЖЕНИЯ</h2>
            <ul className={s.info__list}>
              <p className={s.info__text}>{achievements}</p>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Info;
