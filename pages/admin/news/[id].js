import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NewsEditor from '../../../components/admin/NewsEditor';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function EditNews() {
  const router = useRouter(); const [news, setNews] = useState(null); const [error, setError] = useState('');
  useEffect(() => { if (!router.query.id) return; fetch(`/api/admin/news/${router.query.id}`).then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.message); return data; }).then(setNews).catch((e) => setError(e.message)); }, [router.query.id]);
  if (error) return <AdminLayout title='Новость'><div>{error}</div></AdminLayout>;
  if (!news) return <AdminLayout title='Загрузка…' />;
  return <NewsEditor initial={news} />;
}
