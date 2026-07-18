import React from 'react';
import Head from 'next/head';
import Preview from '../../components/Direction/Preview/Preview';
import { data } from './';
import Info from '../../components/Direction/Info/Info';

export const getServerSideProps = async (context) => {
  return {
    props: { info: data.filter((info) => info.id == context.params.id)[0] },
  };
};

const id = ({ info }) => {
  return (
    <div>
      <Head>
        <title>Ансамбль Сирин - {info.title}</title>
      </Head>
      <Preview title='направления' titleSpan='обучения' />
      <Info directionInfo={info} />
    </div>
  );
};

export default id;
