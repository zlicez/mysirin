import Head from 'next/head';
import React from 'react';
import Error from '../components/Error/Error';
import SecHeader from '../components/SecHeader/SecHeader';

export default function custom404() {
    return (
        <Error />
    )
}

custom404.getLayout = function getLayout(page) {
    return (
        <>
            <Head>
                <title>Страница не найдена</title>
            </Head>
            <SecHeader />
            {page}
        </>
    )
}