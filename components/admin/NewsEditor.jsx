import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from './AdminLayout';
import ImageUploader, { GalleryUploader } from './ImageUploader';
import RichTextEditor from './RichTextEditor';
import s from './Admin.module.scss';

const initialNews = {
  title: '', text: '', status: 'PUBLISHED', coverImage: '',
  publishedAt: new Date().toISOString(), gallery: [],
};

const inputDate = (value) => new Date(value).toISOString().slice(0, 10);

function publicationDate(value) {
  const selected = new Date(value);
  const now = new Date();
  if (inputDate(selected) === inputDate(now) && selected > now) return now.toISOString();
  return selected.toISOString();
}

export default function NewsEditor({ initial = initialNews }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...initialNews, ...initial });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function set(name, value) { setForm((current) => ({ ...current, [name]: value })); }

  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const isEdit = Boolean(form.id);
      const response = await fetch(isEdit ? `/api/admin/news/${form.id}` : '/api/admin/news', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, publishedAt: publicationDate(form.publishedAt) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Не удалось сохранить новость');
      await router.push(`/admin/news?saved=${isEdit ? 'updated' : 'created'}`);
    } catch (saveError) {
      setError(saveError.message);
    } finally { setBusy(false); }
  }

  return (
    <AdminLayout title={form.id ? 'Редактирование новости' : 'Новая новость'}>
      <form className={s.form} onSubmit={save}>
        {error && <div className={s.error}>{error}</div>}
        <div className={s.panel}>
          <div className={s.field}><label>Заголовок</label><input className={s.input} value={form.title} onChange={(e) => set('title', e.target.value)} required /></div>
        </div>
        <div className={`${s.panel} ${s.grid2}`}>
          <div className={s.field}><label>Дата публикации</label><input className={s.input} type='date' value={inputDate(form.publishedAt)} onChange={(e) => set('publishedAt', new Date(`${e.target.value}T12:00:00`).toISOString())} required /></div>
          <div className={s.field}><label>Статус</label><select className={s.select} value={form.status} onChange={(e) => set('status', e.target.value)}>{form.id && <option value='DRAFT'>Скрыта с сайта</option>}<option value='PUBLISHED'>Опубликована</option></select></div>
        </div>
        <div className={s.panel}><ImageUploader label='Обложка — автоматически 1230×692' kind='cover' value={form.coverImage} onChange={(value) => set('coverImage', value)} /></div>
        <div className={s.panel}><div className={s.field}><label>Текст новости</label><RichTextEditor value={form.text} onChange={(value) => set('text', value)} /></div></div>
        <div className={s.panel}><GalleryUploader value={form.gallery} onChange={(value) => set('gallery', value)} /></div>
        <div className={s.actions}><button type='submit' className={s.button} disabled={busy}>{busy ? 'Сохранение…' : 'Сохранить'}</button><button type='button' className={s.buttonSecondary} onClick={() => router.push('/admin/news')}>К списку</button></div>
      </form>
    </AdminLayout>
  );
}
