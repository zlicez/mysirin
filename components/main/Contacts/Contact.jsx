import React from 'react';

// Components
import Header from './Header/Header';

// Style
import s from './Contact.module.scss';

const Contact = ({ contacts, error }) => {
  const phones =
    contacts && contacts?.filter((current) => current.type === 'phone');
  const email =
    contacts && contacts?.filter((current) => current.type === 'email');

  return (
    <div className={s.contact}>
      <div className={s.anchor} id='contacts'></div>
      <div className={s.contact__wrapper}>
        <Header />

        <div className={s.contact__info}>
          <div className={s.contact__list}>
            <div
              className={[s.contact__item, s.contact__item_adress].join(' ')}
            >
              <h2 className={s.contact__title}>МЫ НАХОДИМСЯ</h2>
              <div className={s.contact__subtitle}>
                <p
                  className={[s.contact__text, s.contact__text_adress].join(
                    ' '
                  )}
                >
                  ул. Земляной Вал, д.27, стр.3, метро Курская
                </p>
                <p
                  className={[s.contact__text, s.contact__text_adress].join(
                    ' '
                  )}
                >
                  ул. Чечулина д.10, ГБУ ЦКС «Южное Измайлово»
                </p>
                <p
                  className={[s.contact__text, s.contact__text_adress].join(
                    ' '
                  )}
                >
                  ул. Первомайская д.93, Место Встречи Первомайский
                </p>
              </div>
            </div>

            <div className={[s.contact__item, s.contact__item_phone].join(' ')}>
              <h2 className={s.contact__title}>НОМЕРА ДЛЯ СВЯЗИ</h2>
              <div className={s.contact__subtitle}>
                {error ? (
                  console.error(error.status)
                ) : (
                  <>
                    {phones.map((current) => {
                      return (
                        <a
                          key={current.id}
                          href={`tel: ${current.data}`}
                          className={s.contact__text}
                        >
                          {current.data}
                        </a>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            <div className={[s.contact__item, s.contact__item_email].join(' ')}>
              <h2 className={s.contact__title}>ЭЛЕКТРОННЫЙ АДРЕC</h2>
              <div className={s.contact__subtitle}>
                {error ? (
                  console.error(error.status)
                ) : (
                  <>
                    {email.map((current) => {
                      return (
                        <a
                          key={current.id}
                          href={`mailto: ${current.data}`}
                          className={[
                            s.contact__text,
                            s.contact__text_email,
                          ].join(' ')}
                        >
                          {current.data}
                        </a>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={s.contact__map}>
            <iframe
              src='https://yandex.ru/map-widget/v1/?um=constructor%3A728d506d6c745f25c8cff26a9acd19d836b64dd7de09faeb997d905986ada744&amp;source=constructor'
              title='Карта расположения ансамбля Сирин'
              loading='lazy'
              width='100%'
              height='100%'
              frameBorder='0'
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
