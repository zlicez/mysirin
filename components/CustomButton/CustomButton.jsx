import React from 'react';
import Link from 'next/link';

// Style
import s from './CustomButton.module.scss';

const CustomButton = ({ text, href }) => {
  return href ? (
    <Link className={s.customButton} href={href}>
      {text}
    </Link>
  ) : (
    <button className={s.customButton}>{text}</button>
  );
};

export default CustomButton;
