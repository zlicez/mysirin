import React from 'react';
import Link from 'next/link';
// Style
import s from './Info.module.scss';

const Info = ({ directionInfo }) => {
  console.log(directionInfo);
  return (
    <div className={s.wrapper}>
      <div className={s.direction}>
        <Link href='/direction' className={s.direction__back}>
          <svg
            width='15'
            height='15'
            viewBox='0 0 35 35'
            xmlns='http://www.w3.org/2000/svg'
          >
            <mask id='path-1-inside-1_1_118'>
              <path d='M0 17.021L17.0208 0.000160876L34.6985 17.6778L17.6777 34.6987L0 17.021Z' />
            </mask>
            <path
              d='M0 17.021L-2.12132 14.8997L-4.24264 17.021L-2.12132 19.1423L0 17.021ZM2.12132 19.1423L19.1422 2.12148L14.8995 -2.12116L-2.12132 14.8997L2.12132 19.1423ZM19.799 32.5773L2.12132 14.8997L-2.12132 19.1423L15.5563 36.82L19.799 32.5773Z'
              mask='url(#path-1-inside-1_1_118)'
            />
          </svg>
          <span>Назад</span>
        </Link>
        <div className={s.direction__info}>
          <h2 className={s.direction__title}>{directionInfo.title}</h2>
        </div>
      </div>

      <div className={s.info}>
        <div className={s.info__item}>
          {!!directionInfo.data?.length &&
            directionInfo.data.map((data, index) => {
              if (data.tag === 'list') {
                return (
                  <ul className={s.info__ul} key={index}>
                    {data.text?.map((t, i) => (
                      <li className={s.info__li} key={i}>
                        {t}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (!data.tag && !!data.text)
                return (
                  <p key={index} className={s.info__text}>
                    {data.text}
                  </p>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Info;
