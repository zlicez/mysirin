import React from 'react';
import Preview from '../../components/Team/Preview/Preview';
import List from '../../components/Team/List/List'

// for SSR
import { fetchAllTeam, teamAPI } from '../../src/team/teamService'
import { wrapper } from '../../src/store/store';
import Head from 'next/head';

// SSR
export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (context) => {
        store.dispatch(fetchAllTeam.initiate())

        const [data] = await Promise.all(store.dispatch(teamAPI.util.getRunningQueriesThunk()))

        if (data.isError) {
            return {
                props: { error: data.error }
            }
        }
        return {
            props: { data: data.data }
        }
    }
)

const index = ({ data, error }) => {
    if (error) {
        console.error(error)
        return (<></>)
    }
    return (
        <div>
            <Head>
                <title>Ансамбль Сирин - Наша команда</title>
            </Head>
            <Preview title='познакомьтесь' textOne='c' titleSpan='нашей' textTwo='командой' />
            <List text='узнать лучше' data={data} />
        </div>
    );
};

export default index;