import { useEffect, useState } from 'react';
import { LoaderCircle, Plus } from 'lucide-react';
import { Modal } from '../../shared/components/UI';
import { createTask, listDepartments, listUsers } from './api';

export function TaskModal({ user, close, saved }) {
  const [departments, setDepartments] = useState([]); const [users, setUsers] = useState([]); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', departmentId: user.departmentId || '', assigneeId: '', priority: 'normal', dueDate: '' });
  useEffect(() => { listDepartments().then((items) => { setDepartments(items); if (!form.departmentId && items[0]) setForm((value) => ({ ...value, departmentId: items[0].id })); }); }, []);
  useEffect(() => { if (form.departmentId) listUsers(form.departmentId).then((items) => setUsers(items.filter((item) => item.role === 'employee'))); }, [form.departmentId]);
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { await createTask({ ...form, departmentId: Number(form.departmentId), assigneeId: form.assigneeId ? Number(form.assigneeId) : null, dueDate: form.dueDate || null }); saved(); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <Modal title="Шинэ ажил үүсгэх" subtitle="Ажлын мэдээллийг бүрэн оруулна уу" close={close}><form className="modal-form" onSubmit={submit}>
    {error && <div className="alert error">{error}</div>}<label className="full">Ажлын гарчиг<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Жишээ: Тайлангийн модуль шинэчлэх" required /></label>
    <label className="full">Дэлгэрэнгүй тайлбар<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Хийх ажлын хүрээ, хүлээгдэж буй үр дүн..." /></label>
    <label>Алба<select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value, assigneeId: '' })}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
    <label>Хариуцагч<select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}><option value="">Оноохгүй</option>{users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}</select></label>
    <label>Дуусах хугацаа<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label><label>Эрэмбэ<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="urgent">Яаралтай</option><option value="normal">Энгийн</option><option value="low">Бага</option></select></label>
    <div className="modal-actions full"><button type="button" className="btn btn-ghost" onClick={close}>Болих</button><button className="btn btn-primary" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : <><Plus size={16} /> Ажил үүсгэх</>}</button></div>
  </form></Modal>;
}
