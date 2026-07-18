import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import s from '../../components/admin/Admin.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function login(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Ошибка входа');
      router.replace(typeof router.query.next === 'string' ? router.query.next : '/admin');
    } catch (loginError) { setError(loginError.message); } finally { setBusy(false); }
  }

  return <div className={s.login}>
    <Head><title>Вход — Сирин CMS</title></Head>
    <form className={`${s.loginCard} ${s.form}`} onSubmit={login}>
      <h1>Сирин CMS</h1>
      {error && <div className={s.error}>{error}</div>}
      <div className={s.field}><label>Email</label><input className={s.input} type='email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete='username' required /></div>
      <div className={s.field}><label>Пароль</label><input className={s.input} type='password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete='current-password' required /></div>
      <button className={s.button} disabled={busy}>{busy ? 'Вход…' : 'Войти'}</button>
    </form>
  </div>;
}
