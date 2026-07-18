import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import s from '../../components/admin/Admin.module.scss';

const statuses = {
  NEW: 'Новая', IN_PROGRESS: 'В работе', CONTACTED: 'Связались', CLOSED: 'Закрыта',
};

export default function ApplicationsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState('');
  const load = () => fetch(`/api/admin/applications?status=${filter}`)
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Не удалось загрузить заявки');
      return data;
    })
    .then((data) => setItems(Array.isArray(data) ? data : []))
    .catch((loadError) => setError(loadError.message));
  useEffect(() => { load(); }, [filter]);
  async function update(id, status) {
    await fetch(`/api/admin/applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    load();
  }
  async function remove(item) {
    if (!window.confirm(`Удалить заявку №${item.id}?`)) return;
    await fetch(`/api/admin/applications/${item.id}`, { method: 'DELETE' });
    load();
  }
  return <AdminLayout title='Заявки'>
    {error && <div className={s.error}>{error}</div>}
    <div className={s.panel}><div className={s.field}><label>Фильтр</label><select className={s.select} value={filter} onChange={(e) => setFilter(e.target.value)}><option value='ALL'>Все</option>{Object.entries(statuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div></div>
    <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Дата</th><th>Заявитель / ученик</th><th>Возраст</th><th>Контакт</th><th>Адрес</th><th>Почта</th><th>Статус</th><th></th></tr></thead><tbody>
      {items.map((item) => <tr key={item.id}><td>{new Date(item.createdAt).toLocaleString('ru-RU')}</td><td><b>{item.fullnameApplicant}</b><br />{item.fullnameStudent}</td><td>{item.ageStudent}</td><td>{item.contact}</td><td>{item.place}</td><td><span className={s.badge}>{item.emailStatus}</span>{item.emailError && <div className={s.muted}>{item.emailError}</div>}</td><td><select className={s.select} value={item.status} onChange={(e) => update(item.id, e.target.value)}>{Object.entries(statuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td><td><button className={s.buttonDanger} onClick={() => remove(item)}>Удалить</button></td></tr>)}
      {!items.length && <tr><td colSpan='8'>Заявок пока нет</td></tr>}
    </tbody></table></div>
  </AdminLayout>;
}
