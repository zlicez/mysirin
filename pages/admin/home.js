import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import s from '../../components/admin/Admin.module.scss';

const empty = { title: '', alt: 'Ансамбль «Сирин»', image: '', position: 0, active: true };

export default function HomeAdmin() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const load = () => fetch('/api/admin/slides')
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Не удалось загрузить карусель');
      return data;
    })
    .then((data) => setSlides(Array.isArray(data) ? data : []))
    .catch((loadError) => setError(loadError.message));
  useEffect(() => { load(); }, []);
  function set(name, value) { setForm((current) => ({ ...current, [name]: value })); }
  function edit(slide) { setForm({ ...slide }); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  async function save(event) {
    event.preventDefault(); setError('');
    const isEdit = Boolean(form.id);
    const response = await fetch(isEdit ? `/api/admin/slides/${form.id}` : '/api/admin/slides', { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const result = await response.json();
    if (!response.ok) return setError(result.message || 'Ошибка сохранения');
    setForm(empty); load();
  }
  async function remove(slide) { if (!window.confirm('Удалить слайд?')) return; await fetch(`/api/admin/slides/${slide.id}`, { method: 'DELETE' }); load(); }
  async function move(index, direction) { const target = index + direction; if (target < 0 || target >= slides.length) return; const items = [...slides]; [items[index], items[target]] = [items[target], items[index]]; setSlides(items); await fetch('/api/admin/slides/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: items.map((item) => item.id) }) }); }
  return <AdminLayout title='Карусель главной'>
    <form className={`${s.form} ${s.panel}`} onSubmit={save}>
      {error && <div className={s.error}>{error}</div>}
      <ImageUploader label='Фотография — автоматически 1920×848' kind='hero' value={form.image} onChange={(value) => set('image', value)} />
      <div className={s.grid2}><div className={s.field}><label>Подпись для доступности</label><input className={s.input} value={form.alt} onChange={(e) => set('alt', e.target.value)} /></div><label className={s.checkbox}><input type='checkbox' checked={form.active} onChange={(e) => set('active', e.target.checked)} /> Показывать</label></div>
      <div className={s.actions}><button className={s.button}>{form.id ? 'Сохранить изменения' : 'Добавить слайд'}</button>{form.id && <button type='button' className={s.buttonSecondary} onClick={() => setForm(empty)}>Отмена</button>}</div>
    </form>
    <div className={s.tableWrap}><table className={s.table}><thead><tr><th>Фото</th><th>Подпись</th><th>Активен</th><th>Порядок</th><th></th></tr></thead><tbody>
      {slides.map((slide, index) => <tr key={slide.id}><td><img className={s.thumbnail} src={`${process.env.NEXT_PUBLIC_STATIC_URL || '/'}${slide.image}`} alt='' /></td><td>{slide.alt}</td><td>{slide.active ? 'Да' : 'Нет'}</td><td><div className={s.actions}><button className={s.buttonSecondary} onClick={() => move(index, -1)}>↑</button><button className={s.buttonSecondary} onClick={() => move(index, 1)}>↓</button></div></td><td><div className={s.actions}><button className={s.buttonSecondary} onClick={() => edit(slide)}>Изменить</button><button className={s.buttonDanger} onClick={() => remove(slide)}>Удалить</button></div></td></tr>)}
    </tbody></table></div>
  </AdminLayout>;
}
