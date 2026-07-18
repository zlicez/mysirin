import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import s from './Admin.module.scss';

const links = [
  ['/admin', 'Главная'],
  ['/admin/news', 'Новости'],
  ['/admin/crew', 'Команда'],
  ['/admin/applications', 'Заявки'],
  ['/admin/home', 'Карусель'],
];

export default function AdminLayout({ title, actions, children }) {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(setAdmin)
      .catch(() => router.replace(`/admin/login?next=${encodeURIComponent(router.asPath)}`));
  }, [router]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  if (!admin) return <div className={s.page}></div>;

  return (
    <div className={s.page}>
      <div className={s.shell}>
        <aside className={s.sidebar}>
          <div className={s.brand}>Сирин CMS</div>
          <nav className={s.nav}>
            {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <button className={s.logout} onClick={logout}>Выйти</button>
        </aside>
        <main className={s.content}>
          <div className={s.header}>
            <div><h1 className={s.title}>{title}</h1><div className={s.muted}>{admin.email}</div></div>
            {actions && <div className={s.actions}>{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
