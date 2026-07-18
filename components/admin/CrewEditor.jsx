import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from './AdminLayout';
import ImageUploader, { GalleryUploader } from './ImageUploader';
import s from './Admin.module.scss';

const initialMember = {
  fullname: '', vacancy: '', subVacancy: '', education: '', experience: '', achievements: '',
  position: 0, photoImage: '', bannerImage: '', active: true, gallery: [],
};

export default function CrewEditor({ initial = initialMember }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...initialMember, ...initial });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  function set(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const isEdit = Boolean(form.id);
      const response = await fetch(isEdit ? `/api/admin/crew/${form.id}` : '/api/admin/crew', {
        method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Не удалось сохранить карточку');
      await router.push(`/admin/crew?saved=${isEdit ? 'updated' : 'created'}`);
    } catch (saveError) { setError(saveError.message); } finally { setBusy(false); }
  }

  return (
    <AdminLayout title={form.id ? 'Редактирование участника' : 'Новый участник'}>
      <form className={s.form} onSubmit={save}>
        {error && <div className={s.error}>{error}</div>}
        <div className={`${s.panel} ${s.grid2}`}>
          <div className={s.field}><label>ФИО</label><input className={s.input} value={form.fullname} onChange={(e) => set('fullname', e.target.value)} required /></div>
          <div className={s.field}><label>Позиция</label><input className={s.input} type='number' min='0' value={form.position} onChange={(e) => set('position', Number(e.target.value))} /></div>
          <div className={s.field}><label>Роль в коллективе</label><textarea className={s.textarea} value={form.vacancy} onChange={(e) => set('vacancy', e.target.value)} required /></div>
          <div className={s.field}><label>Дополнительная роль</label><textarea className={s.textarea} value={form.subVacancy} onChange={(e) => set('subVacancy', e.target.value)} /></div>
        </div>
        <div className={`${s.panel} ${s.grid2}`}>
          <ImageUploader label='Фото профиля — автоматическое кадрирование 4:3' kind='profile' value={form.photoImage} onChange={(value) => set('photoImage', value)} />
          <ImageUploader label='Баннер / задний фон' kind='banner' value={form.bannerImage} onChange={(value) => set('bannerImage', value)} />
        </div>
        <div className={s.panel}>
          <div className={s.field}><label>Образование</label><textarea className={s.textarea} value={form.education} onChange={(e) => set('education', e.target.value)} /></div>
          <div className={s.field}><label>Стаж работы</label><textarea className={s.textarea} value={form.experience} onChange={(e) => set('experience', e.target.value)} /></div>
          <div className={s.field}><label>Достижения</label><textarea className={s.textarea} value={form.achievements} onChange={(e) => set('achievements', e.target.value)} /></div>
          <label className={s.checkbox}><input type='checkbox' checked={form.active} onChange={(e) => set('active', e.target.checked)} /> Показывать на сайте</label>
        </div>
        <div className={s.panel}><GalleryUploader value={form.gallery} onChange={(value) => set('gallery', value)} /></div>
        <div className={s.actions}><button type='submit' className={s.button} disabled={busy}>{busy ? 'Сохранение…' : 'Сохранить'}</button><button type='button' className={s.buttonSecondary} onClick={() => router.push('/admin/crew')}>К списку</button></div>
      </form>
    </AdminLayout>
  );
}
