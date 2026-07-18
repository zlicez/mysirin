import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import s from '../../../components/admin/Admin.module.scss';

const mediaUrl = (filename) => filename ? `${process.env.NEXT_PUBLIC_STATIC_URL || '/'}${filename}` : '';

export default function AdminCrew() {
  const router = useRouter();
  const [crew, setCrew] = useState([]);
  const [error, setError] = useState('');
  const load = () => fetch('/api/admin/crew')
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Не удалось загрузить команду');
      return data;
    })
    .then((data) => setCrew(Array.isArray(data) ? data : []))
    .catch((loadError) => setError(loadError.message));
  useEffect(() => { load(); }, []);
  async function persist(items) {
    setCrew(items);
    await fetch('/api/admin/crew/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: items.map((item) => item.id) }) });
  }
  function move(index, direction) { const target = index + direction; if (target < 0 || target >= crew.length) return; const items = [...crew]; [items[index], items[target]] = [items[target], items[index]]; persist(items); }
  async function remove(item) { if (!window.confirm(`Удалить ${item.fullname}?`)) return; await fetch(`/api/admin/crew/${item.id}`, { method: 'DELETE' }); load(); }
  return <AdminLayout title='Команда' actions={<Link className={s.button} href='/admin/crew/new'>Добавить участника</Link>}>
    {router.query.saved && <div className={s.success}>{router.query.saved === 'created' ? 'Участник создан и сохранён.' : 'Изменения участника сохранены.'}</div>}
    {error && <div className={s.error}>{error}</div>}
    <div className={s.panel}>Порядок строк соответствует порядку карточек на главной. Используйте стрелки для перестановки.</div>
    <div className={s.tableWrap}><table className={s.table}><thead><tr><th>№</th><th>Фото</th><th>ФИО</th><th>Роль</th><th>Порядок</th><th></th></tr></thead><tbody>
      {crew.map((item, index) => <tr key={item.id}><td>{index + 1}</td><td>{item.photoImage && <img className={s.thumbnail} src={mediaUrl(item.photoImage)} alt='' />}</td><td>{item.fullname}</td><td>{item.vacancy}</td><td><div className={s.actions}><button className={s.buttonSecondary} onClick={() => move(index, -1)}>↑</button><button className={s.buttonSecondary} onClick={() => move(index, 1)}>↓</button></div></td><td><div className={s.actions}><Link className={s.buttonSecondary} href={`/admin/crew/${item.id}`}>Изменить</Link><button className={s.buttonDanger} onClick={() => remove(item)}>Удалить</button></div></td></tr>)}
    </tbody></table></div>
  </AdminLayout>;
}
