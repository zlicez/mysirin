import React, { useEffect } from 'react';

import s from './FormWrapper.module.scss'
import Form from '../Form/Form';
import { useRouter } from 'next/router';

const FormWrapper = () => {
    const route = useRouter()

    useEffect(() => {
        route.query.form === 'open' ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset'
    }, [route])

    return (
        <div className={[s.wrapper, route.query.form === 'open' && s.wrapper__open].join(' ')}
            onClick={() => route.push(route.asPath.replace('?form=open', ''), undefined, { scroll: false })}
        >
            <div className={s.wrapper__info}>
                <Form isPopup />
            </div>
        </div >
    );
};

export default FormWrapper;
