import React from 'react';
import {
  fetchAllNews,
  fetchPreviewNews,
  newsAPI,
} from '../../src/news/newsService';
import { wrapper } from '../../src/store/store';
// Component
import Preview from '../../components/News/Preview/Preview';
import List from '../../components/News/List/List';
import Flags from '../../components/News/Flags/Flags';
import Head from 'next/head';

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    store.dispatch(fetchAllNews.initiate({ page: context.query.page ?? 1 }));
    store.dispatch(fetchPreviewNews.initiate());

    const [allNews, previewNews] = await Promise.all(
      store.dispatch(newsAPI.util.getRunningQueriesThunk())
    );

    if (allNews.isError) {
      return {
        props: { error: allNews.error },
      };
    }
    if (previewNews.isError) {
      return {
        props: { error: previewNews.error },
      };
    }
    return {
      props: { allNews: allNews.data, previewNews: previewNews.data },
    };
  }
);

const news = ({ allNews, previewNews, error }) => {
  if (error) {
    console.error(error);
    return <> </>;
  }

  return (
    <div>
      <Head>
        <title>Ансамбль Сирин - Новости</title>
      </Head>
      <Preview previewNews={previewNews?.data[0]} />
      <List previewNews={previewNews?.data[0]} news={allNews.data} />
      {allNews.data.length > 0 && <Flags count={allNews?.count} />}
    </div>
  );
};

export default news;
