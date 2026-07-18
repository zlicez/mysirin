import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import CrewEditor from '../../../components/admin/CrewEditor';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function EditCrew() {
  const router = useRouter(); const [member, setMember] = useState(null); const [error, setError] = useState('');
  useEffect(() => { if (!router.query.id) return; fetch(`/api/admin/crew/${router.query.id}`).then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.message); return data; }).then(setMember).catch((e) => setError(e.message)); }, [router.query.id]);
  if (error) return <AdminLayout title='Участник'><div>{error}</div></AdminLayout>;
  if (!member) return <AdminLayout title='Загрузка…' />;
  return <CrewEditor initial={member} />;
}
