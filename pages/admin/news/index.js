import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import s from '../../../components/admin/Admin.module.scss';

const mediaUrl = (filename) => filename ? `${process.env.NEXT_PUBLIC_STATIC_URL || '/'}${filename}` : '';

export default function AdminNews() {
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [error, setError] = useState('');
  const load = () => fetch('/api/admin/news').then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.message); return data; }).then(setNews).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);
  async function remove(item) {
    if (!window.confirm(`Удалить новость «${item.title}»?`)) return;
    await fetch(`/api/admin/news/${item.id}`, { method: 'DELETE' }); load();
  }
  return <AdminLayout title='Новости' actions={<Link className={s.button} href='/admin/news/new'>Добавить новость</Link>}>
    {router.query.saved && <div className={s.success}>{router.query.saved === 'created' ? 'Новость создана, опубликована и уже доступна на сайте.' : 'Изменения новости сохранены.'}</div>}
    {error && <div className={s.error}>{error}</div>}
    <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Обложка</th><th>Заголовок</th><th>Дата</th><th>Статус</th><th></th></tr></thead><tbody>
      {news.map((item) => <tr key={item.id}><td>{item.coverImage && <img className={s.thumbnail} src={mediaUrl(item.coverImage)} alt='' />}</td><td>{item.title}</td><td>{new Date(item.publishedAt).toLocaleDateString('ru-RU')}</td><td><span className={s.badge}>{item.status === 'PUBLISHED' ? 'Опубликована' : 'Черновик'}</span></td><td><div className={s.actions}><Link className={s.buttonSecondary} href={`/admin/news/${item.id}`}>Изменить</Link><button className={s.buttonDanger} onClick={() => remove(item)}>Удалить</button></div></td></tr>)}
      {!news.length && <tr><td colSpan='5'>Новостей пока нет</td></tr>}
    </tbody></table></div>
  </AdminLayout>;
}
