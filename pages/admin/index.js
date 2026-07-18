import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import s from '../../components/admin/Admin.module.scss';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/admin/dashboard').then((r) => r.ok ? r.json() : null).then(setData); }, []);
  const cards = [
    ['Новостей', data?.news ?? '—'], ['Участников команды', data?.crew ?? '—'],
    ['Отзывов', data?.reviews ?? '—'],
    ['Всего заявок', data?.applications ?? '—'], ['Новых заявок', data?.newApplications ?? '—'],
    ['Слайдов', data?.slides ?? '—'],
  ];
  return <AdminLayout title='Панель управления'>
    <div className={s.cards}>{cards.map(([label, value]) => <div className={s.card} key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className={s.panel} style={{ marginTop: 20 }}><b>Подсказка:</b> сначала загрузите изображения, заполните карточку и сохраните. Черновики новостей не показываются посетителям.</div>
  </AdminLayout>;
}
