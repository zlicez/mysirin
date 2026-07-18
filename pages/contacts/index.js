import React, { useEffect } from 'react';
import PreviewContacts from '../../components/PreviewContacts/PreviewContacts';

// for SSR
import { wrapper } from "../../src/store/store";
import { contactsAPI, fetchContact } from "../../src/contacts/contacts";
import Head from "next/head";
import Find from '../../components/Find/Find';
import Form from '../../components/Form/Form';

import s from './index.module.scss'
import ContactsInfo from '../../components/ContactsInfo/ContactsInfo';


// SSR for team
export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (context) => {
        store.dispatch(fetchContact.initiate());
        const [contacts] = await Promise.all(
            store.dispatch(contactsAPI.util.getRunningQueriesThunk()),
        );

        return {
            props: {
                contacts: !contacts.isError && contacts.data,
                contactsError: contacts.isError && contacts.error,
            },
        };
    },
);

const ContactsPage = ({ contacts, contactsError }) => {
    const [adress, setAdress] = React.useState({
        isShow: false,
        number: null,
    })

    useEffect(() => {
        adress.isShow ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset'
    }, [adress])

    return (
        <div>
            <Head>
                <title>Ансамбль Сирин - Контакты</title>
            </Head>

            <PreviewContacts contacts={contacts} error={contactsError} />
            <Find setAdress={setAdress} />
            <div className={s.form}>
                <Form />
            </div>
            <ContactsInfo adress={adress} setAdress={setAdress} />
        </div>
    );
};

export default ContactsPage;
