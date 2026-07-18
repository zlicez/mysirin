import React from 'react';
// components
import CustomButton from '../../CustomButton/CustomButton';
// Style
import s from './List.module.scss';

const List = ({ info, text }) => {
  const resultData = info.map((current) => {
    return (
      <div key={current.id} className={s.item}>
        <img className={s.item__img} src={current.img.src} />
        <div className={s.item__head}>
          <h2 className={s.item__title}>{current.title}</h2>
        </div>

        <div className={s.item__button}>
          <CustomButton text={text} href={current.href ? current.href : null} />
        </div>
      </div>
    );
  });

  return <div className={s.list}>{resultData}</div>;
};

export default List;
