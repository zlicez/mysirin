import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ImageUploader from '../../components/admin/ImageUploader';
import s from '../../components/admin/Admin.module.scss';

const emptyReview = {
  text: '',
  fullname: '',
  vacancy: '',
  photoImage: '',
  active: true,
};

const mediaUrl = (filename) => filename
  ? `${process.env.NEXT_PUBLIC_STATIC_URL || '/'}${filename}`
  : '';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(emptyReview);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      const response = await fetch('/api/admin/reviews');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Не удалось загрузить отзывы');
      setReviews(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message);
    }
  }

  useEffect(() => { load(); }, []);

  function set(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function edit(review) {
    setForm({ ...review });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setForm(emptyReview);
    setError('');
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSuccess('');
    const isEdit = Boolean(form.id);

    try {
      const response = await fetch(
        isEdit ? `/api/admin/reviews/${form.id}` : '/api/admin/reviews',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Не удалось сохранить отзыв');
      setForm(emptyReview);
      setSuccess(isEdit ? 'Изменения отзыва сохранены.' : 'Отзыв создан и добавлен в карусель.');
      await load();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(review) {
    if (!window.confirm(`Удалить отзыв от «${review.fullname}»?`)) return;
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Не удалось удалить отзыв');
      }
      if (form.id === review.id) setForm(emptyReview);
      setSuccess('Отзыв удалён.');
      await load();
    } catch (removeError) {
      setError(removeError.message);
    }
  }

  async function move(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= reviews.length) return;
    const items = [...reviews];
    [items[index], items[target]] = [items[target], items[index]];
    setReviews(items);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/reviews/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: items.map((item) => item.id) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Не удалось изменить порядок');
      setSuccess('Порядок отзывов сохранён.');
    } catch (moveError) {
      setError(moveError.message);
      await load();
    }
  }

  return (
    <AdminLayout title='Отзывы'>
      <form className={`${s.form} ${s.panel}`} onSubmit={save}>
        {error && <div className={s.error}>{error}</div>}
        {success && <div className={s.success}>{success}</div>}
        <div className={s.grid2}>
          <div className={s.field}>
            <label htmlFor='review-fullname'>Имя автора</label>
            <input
              id='review-fullname'
              className={s.input}
              value={form.fullname}
              onChange={(event) => set('fullname', event.target.value)}
              required
            />
          </div>
          <div className={s.field}>
            <label htmlFor='review-vacancy'>Кто написал / роль</label>
            <input
              id='review-vacancy'
              className={s.input}
              value={form.vacancy}
              onChange={(event) => set('vacancy', event.target.value)}
              placeholder='Например: мама ученицы ансамбля'
              required
            />
          </div>
        </div>
        <div className={s.field}>
          <label htmlFor='review-text'>Текст отзыва</label>
          <textarea
            id='review-text'
            className={s.textarea}
            value={form.text}
            onChange={(event) => set('text', event.target.value)}
            required
          />
        </div>
        <ImageUploader
          label='Аватар автора — автоматически кадрируется в квадрат'
          kind='avatar'
          value={form.photoImage}
          onChange={(value) => set('photoImage', value)}
        />
        <label className={s.checkbox}>
          <input
            type='checkbox'
            checked={form.active}
            onChange={(event) => set('active', event.target.checked)}
          />
          Показывать в карусели на главной
        </label>
        <div className={s.actions}>
          <button type='submit' className={s.button} disabled={busy}>
            {busy ? 'Сохранение…' : form.id ? 'Сохранить изменения' : 'Добавить отзыв'}
          </button>
          {form.id && (
            <button type='button' className={s.buttonSecondary} onClick={resetForm}>
              Отменить редактирование
            </button>
          )}
        </div>
      </form>

      <div className={s.panel}>
        Порядок строк соответствует порядку отзывов в карусели. Скрытые отзывы остаются в CMS,
        но на сайте не показываются.
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>№</th>
              <th>Аватар</th>
              <th>Автор</th>
              <th>Отзыв</th>
              <th>Статус</th>
              <th>Порядок</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td>
                  {review.photoImage
                    ? <img className={s.avatarThumbnail} src={mediaUrl(review.photoImage)} alt='' />
                    : <span className={s.muted}>Нет</span>}
                </td>
                <td>
                  <strong>{review.fullname}</strong>
                  <div className={s.muted}>{review.vacancy}</div>
                </td>
                <td className={s.reviewText}>{review.text}</td>
                <td>
                  <span className={s.badge}>{review.active ? 'Показывается' : 'Скрыт'}</span>
                </td>
                <td>
                  <div className={s.actions}>
                    <button
                      type='button'
                      className={s.buttonSecondary}
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={`Поднять отзыв ${review.fullname}`}
                    >
                      ↑
                    </button>
                    <button
                      type='button'
                      className={s.buttonSecondary}
                      onClick={() => move(index, 1)}
                      disabled={index === reviews.length - 1}
                      aria-label={`Опустить отзыв ${review.fullname}`}
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <div className={s.actions}>
                    <button type='button' className={s.buttonSecondary} onClick={() => edit(review)}>
                      Изменить
                    </button>
                    <button type='button' className={s.buttonDanger} onClick={() => remove(review)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!reviews.length && <div className={s.emptyState}>Отзывов пока нет.</div>}
      </div>
    </AdminLayout>
  );
}
