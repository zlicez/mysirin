import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
// Style
import s from './Form.module.scss';

import axios from 'axios';
import { useRouter } from 'next/router';

const Form = ({ isPopup }) => {
  const ref = React.createRef();
  const [submitStatus, setSubmitStatus] = useState('idle');

  const route = useRouter();

  let [placeholder, setPlaceholder] = useState('');
  useEffect(() => {
    if (window)
      window.screen.width > 420
        ? setPlaceholder('ВВЕДИТЕ НОМЕР ТЕЛЕФОНА ИЛИ E-MAIL')
        : setPlaceholder('НОМЕР ТЕЛЕФОНА ИЛИ E-MAIL');
  }, []);

  const SignupSchema = Yup.object().shape({
    applicant: Yup.string().trim().required('Вы не ввели имя'),
    student: Yup.string().trim().required('Вы не ввели имя ученика'),
    age: Yup.number().required('Вы не ввели возраст'),
    contact: Yup.string()
      .matches(
        /^(\s*)?(\+7|7|8)+([- _():=+]?\d[- _():=+]?){10}(\s*)|[a-z0-9]+@[a-z]+\.[a-z]{2,5}?$/,
        'Телефон или email не подходит'
      )
      .required('Вы не ввели контакт'),
  });

  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      applicant: '',
      student: '',
      age: '',
      contact: '',
      adress: 'м. Курская ул. Земляной Вал д.27, стр.3',
    },
    validateOnChange: true,
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      setSubmitStatus('loading');
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + 'courses', {
          fullname_applicant: values.applicant,
          fullname_student: values.student,
          age_student: values.age,
          contact: values.contact,
          place: values.adress,
        })
        .then((responce) => {
          setSubmitStatus('success');
          route.push(route.asPath.replace('?form=open', ''), undefined, {
            scroll: false,
          });
          formik.resetForm();
        })
        .catch((error) => {
          console.error(error);
          setSubmitStatus('error');
        });

      ref.current.checked = true;
      if (ref.current.checked == true) {
        values.adress = 'м. Курская ул. Земляной Вал д.27, стр.3';
      } else {
        values.adress = 'ул. Чечулина, д.10, ГБУ ЦКС «Южное Измайлово»';
      }
    },
  });

  return (
    <div className={s.form} onClick={(e) => e.stopPropagation()}>
      <div
        className={[
          s.form__wrapper,
          route.pathname === '/contacts' && s.form__wrapper_shadow,
        ].join(' ')}
      >
        {route.pathname === '/contacts' ? (
          <h2 className={[s.form__header_row, s.form__header].join(' ')}>
            Запишись на курсы
          </h2>
        ) : (
          <h2 className={s.form__header}>
            <span className={s.form__header_span}>заявка</span> на обучение
          </h2>
        )}
        <form onSubmit={formik.handleSubmit} className={s.form__info}>
          <div className={s.form__list}>
            <div className={[s.form__item, s.form__item_applicant].join(' ')}>
              <h2 className={s.form__title}>ФИО ЗАЯВИТЕЛЯ</h2>
              <input
                className={[
                  s.form__input,
                  formik.errors.applicant &&
                    formik.touched.applicant &&
                    s.form__input_error,
                ].join(' ')}
                autoComplete='off'
                onChange={formik.handleChange}
                type='text'
                name='applicant'
                value={formik.values.applicant}
                onBlur={formik.handleBlur}
                placeholder='ВВЕДИТЕ ФИО ЗАЯВИТЕЛЯ'
              />
            </div>

            <div className={[s.form__item, s.form__item_student].join(' ')}>
              <h2 className={s.form__title}>ФИО ОБУЧАЮЩЕГОСЯ</h2>
              <input
                className={[
                  s.form__input,
                  formik.errors.student &&
                    formik.touched.student &&
                    s.form__input_error,
                ].join(' ')}
                autoComplete='off'
                onChange={formik.handleChange}
                type='text'
                name='student'
                value={formik.values.student}
                onBlur={formik.handleBlur}
                placeholder='ВВЕДИТЕ ФИО ОБУЧАЮЩЕГОСЯ'
              />
            </div>

            <div className={[s.form__item, s.form__item_age].join(' ')}>
              <h2 className={s.form__title}>ВОЗРАСТ ОБУЧАЮЩЕГОСЯ</h2>
              <input
                className={[
                  s.form__input,
                  formik.touched.age &&
                    formik.errors.age &&
                    s.form__input_error,
                ].join(' ')}
                autoComplete='off'
                onChange={formik.handleChange}
                type='number'
                name='age'
                value={formik.values.age}
                onBlur={formik.handleBlur}
                placeholder='ВВЕДИТЕ ВОЗРАСТ ОБУЧАЮЩЕГОСЯ'
              />
            </div>

            <div className={[s.form__item, s.form__item_contact].join(' ')}>
              <h2 className={s.form__title}>КОНТАКТЫ СВЯЗИ</h2>
              <input
                className={[
                  s.form__input,
                  formik.errors.contact &&
                    formik.touched.contact &&
                    s.form__input_error,
                ].join(' ')}
                autoComplete='off'
                onChange={formik.handleChange}
                type='text'
                name='contact'
                value={formik.values.contact}
                onBlur={formik.handleBlur}
                placeholder={placeholder}
              />
            </div>

            <div className={[s.form__item, s.form__item_adress].join(' ')}>
              <h2 className={s.form__title}>ВЫБЕРИТЕ МЕСТО ОБУЧЕНИЯ</h2>
              <div className={s.form__radios}>
                <div>
                  <input
                    className={s.form__radio}
                    onChange={formik.handleChange}
                    type='radio'
                    name='adress'
                    value='м. Курская ул. Земляной Вал д.27, стр.3'
                    defaultChecked={true}
                    id={isPopup ? 'adress_one_popup' : 'adress_one_not_popup'}
                    ref={ref}
                  />
                  <label
                    className={s.form__label}
                    htmlFor={
                      isPopup ? 'adress_one_popup' : 'adress_one_not_popup'
                    }
                  >
                    <svg
                      width='46'
                      height='63'
                      viewBox='0 0 46 63'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M22.9997 2C11.4265 2 2 11.6338 2 23.4615C2 33.4259 13.2069 50.4659 19.2468 58.926C21.1223 61.5531 24.9059 61.5738 26.8042 58.9631C32.8561 50.6402 43.9993 33.9099 43.9993 23.5569C44.0926 11.6338 34.6661 2 22.9997 2ZM22.9997 34.0492C16.6531 34.0492 11.6132 28.8031 11.6132 22.4123C11.6132 15.9262 16.7464 10.7754 22.9997 10.7754C29.3462 10.7754 34.3861 16.0215 34.3861 22.4123C34.4795 28.8031 29.3462 34.0492 22.9997 34.0492Z'
                        stroke='#1491FF'
                        strokeWidth='3'
                      />
                    </svg>
                    <span className={s.form__text}>
                      м. Курская ул. Земляной Вал д.27, стр.3
                    </span>
                  </label>
                </div>
                <div>
                  <input
                    className={s.form__radio}
                    onChange={formik.handleChange}
                    type='radio'
                    name='adress'
                    value='ул. Чечулина, д.10, ГБУ ЦКС «Южное Измайлово»'
                    id={isPopup ? 'adress_two_popup' : 'adress_two_not_popup'}
                  />
                  <label
                    className={s.form__label}
                    htmlFor={
                      isPopup ? 'adress_two_popup' : 'adress_two_not_popup'
                    }
                  >
                    <svg
                      width='46'
                      height='63'
                      viewBox='0 0 46 63'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M22.9997 2C11.4265 2 2 11.6338 2 23.4615C2 33.4259 13.2069 50.4659 19.2468 58.926C21.1223 61.5531 24.9059 61.5738 26.8042 58.9631C32.8561 50.6402 43.9993 33.9099 43.9993 23.5569C44.0926 11.6338 34.6661 2 22.9997 2ZM22.9997 34.0492C16.6531 34.0492 11.6132 28.8031 11.6132 22.4123C11.6132 15.9262 16.7464 10.7754 22.9997 10.7754C29.3462 10.7754 34.3861 16.0215 34.3861 22.4123C34.4795 28.8031 29.3462 34.0492 22.9997 34.0492Z'
                        stroke='#1491FF'
                        strokeWidth='3'
                      />
                    </svg>
                    <span className={s.form__text}>
                      ул. Чечулина, д.10, ГБУ ЦКС «Южное Измайлово»
                    </span>
                  </label>
                </div>
                <div>
                  <input
                    className={s.form__radio}
                    onChange={formik.handleChange}
                    type='radio'
                    name='adress'
                    value='ул. Первомайская д.93, Место Встречи Первомайский'
                    id={
                      isPopup ? 'adress_three_popup' : 'adress_threenot_popup'
                    }
                  />
                  <label
                    className={s.form__label}
                    htmlFor={
                      isPopup ? 'adress_three_popup' : 'adress_threenot_popup'
                    }
                  >
                    <svg
                      width='46'
                      height='63'
                      viewBox='0 0 46 63'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M22.9997 2C11.4265 2 2 11.6338 2 23.4615C2 33.4259 13.2069 50.4659 19.2468 58.926C21.1223 61.5531 24.9059 61.5738 26.8042 58.9631C32.8561 50.6402 43.9993 33.9099 43.9993 23.5569C44.0926 11.6338 34.6661 2 22.9997 2ZM22.9997 34.0492C16.6531 34.0492 11.6132 28.8031 11.6132 22.4123C11.6132 15.9262 16.7464 10.7754 22.9997 10.7754C29.3462 10.7754 34.3861 16.0215 34.3861 22.4123C34.4795 28.8031 29.3462 34.0492 22.9997 34.0492Z'
                        stroke='#1491FF'
                        strokeWidth='3'
                      />
                    </svg>
                    <span className={s.form__text}>
                      ул. Первомайская д.93, Место Встречи Первомайский
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          {submitStatus === 'success' && <p>Заявка отправлена. Мы свяжемся с вами.</p>}
          {submitStatus === 'error' && <p>Не удалось отправить заявку. Попробуйте ещё раз.</p>}
          <button className={s.form__button} type='submit' disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'ОТПРАВКА…' : 'ОТПРАВИТЬ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
