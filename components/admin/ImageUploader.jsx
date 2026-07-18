import { useState } from 'react';
import s from './Admin.module.scss';

const mediaUrl = (filename) => filename ? `${process.env.NEXT_PUBLIC_STATIC_URL || '/'}${filename}` : '';

export default function ImageUploader({ label, kind = 'gallery', value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setError('');
    const body = new FormData();
    body.append('file', file);
    body.append('kind', kind);
    try {
      const response = await fetch('/api/admin/upload', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Ошибка загрузки');
      onChange(result.filename);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  return (
    <div className={s.uploader}>
      <strong>{label}</strong>
      {value && <img className={s.preview} src={mediaUrl(value)} alt='' />}
      <div className={s.actions}>
        <label className={s.buttonSecondary}>
          {busy ? 'Загрузка…' : value ? 'Заменить' : 'Загрузить'}
          <input hidden type='file' accept='image/*' onChange={upload} disabled={busy} />
        </label>
        {value && <button type='button' className={s.buttonDanger} onClick={() => onChange('')}>Убрать</button>}
      </div>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
}

export function GalleryUploader({ value = [], onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function upload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true); setError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file); body.append('kind', 'gallery');
        const response = await fetch('/api/admin/upload', { method: 'POST', body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Ошибка загрузки');
        uploaded.push(result.filename);
      }
      onChange([...value, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setBusy(false); event.target.value = '';
    }
  }

  return (
    <div className={s.uploader}>
      <strong>Галерея (необязательно)</strong>
      <div className={s.gallery}>
        {value.map((filename, index) => (
          <div className={s.galleryItem} key={`${filename}-${index}`}>
            <img src={mediaUrl(filename)} alt='' />
            <button type='button' onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>×</button>
          </div>
        ))}
      </div>
      <label className={s.buttonSecondary}>
        {busy ? 'Загрузка…' : 'Добавить фотографии'}
        <input hidden multiple type='file' accept='image/*' onChange={upload} disabled={busy} />
      </label>
      {error && <div className={s.error}>{error}</div>}
    </div>
  );
}
