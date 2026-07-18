import React from 'react';

import s from './PreviewContacts.module.scss';

const PreviewContacts = ({ contacts, error }) => {
  const phones =
    contacts && contacts?.filter((current) => current.type === 'phone');
  const email =
    contacts && contacts?.filter((current) => current.type === 'email');

  const Contacts = () => {
    return (
      <div className={s.contacts__wrapper}>
        <div className={s.contacts}>
          <div className={s.contacts__item}>
            <h2 className={s.contacts__title}>Мы находимся</h2>
            <div className={s.contacts__subtitle}>
              <p
                className={[s.contacts__text, s.contacts__text_adress].join(
                  ' '
                )}
              >
                ул. Земляной Вал, д.27, стр.3, метро Курская
              </p>
              <p
                className={[s.contacts__text, s.contacts__text_adress].join(
                  ' '
                )}
              >
                ул. Чечулина д.10, ГБУ ЦКС «Южное Измайлово»
              </p>
              <p
                className={[s.contacts__text, s.contacts__text_adress].join(
                  ' '
                )}
              >
                ул. Первомайская д.93, Место Встречи Первомайский
              </p>
            </div>
          </div>

          <div className={s.contacts__item}>
            <h2 className={s.contacts__title}>Номера для связи</h2>
            <div className={s.contacts__subtitle}>
              {error ? (
                console.error(error.status)
              ) : (
                <>
                  {phones.map((current) => {
                    return (
                      <a
                        key={current.id}
                        href={`tel: ${current.data}`}
                        className={s.contacts__text}
                      >
                        {current.data}
                      </a>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          <div className={s.contacts__item}>
            <h2 className={s.contacts__title}>Электронный адрес</h2>
            <div className={s.contacts__subtitle}>
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
                          s.contacts__text,
                          s.contacts__text_email,
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
      </div>
    );
  };

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <h1 className={s.header__title}>
          свяжитесь <span className={s.header__title_span}>с нами</span>
        </h1>
      </div>
      <div className={s.list}>
        <Contacts />
        <iframe
          className={s.list__map}
          src='https://yandex.ru/map-widget/v1/?um=constructor%3A728d506d6c745f25c8cff26a9acd19d836b64dd7de09faeb997d905986ada744&amp;source=constructor'
          title='Карта расположения ансамбля Сирин'
          loading='lazy'
          width='100%'
          height='100%'
          frameBorder='0'
        ></iframe>
      </div>
    </div>
  );
};

export default PreviewContacts;
