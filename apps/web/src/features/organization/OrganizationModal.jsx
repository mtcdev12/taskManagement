import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Modal } from '../../shared/components/UI';
import { createDepartment, createUser } from './api';

export function OrganizationModal({ type, departments, close, saved }) {
  const isDepartment = type === 'department'; const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [form, setForm] = useState(isDepartment ? { name: '', description: '' } : { fullName: '', email: '', password: '', role: 'employee', departmentId: departments[0]?.id || '' });
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(''); try { const payload = isDepartment ? form : { ...form, departmentId: form.departmentId ? Number(form.departmentId) : null }; await (isDepartment ? createDepartment(payload) : createUser(payload)); saved(); } catch (err) { setError(err.message); } finally { setSaving(false); } };
  return <Modal title={isDepartment ? 'Шинэ алба нэмэх' : 'Шинэ хэрэглэгч нэмэх'} subtitle="Мэдээллийг бүрэн оруулна уу" close={close}><form className="modal-form" onSubmit={submit}>
    {error && <div className="alert error full">{error}</div>}
    {isDepartment ? <><label className="full">Албаны нэр<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label><label className="full">Тайлбар<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" /></label></> : <><label className="full">Овог нэр<input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></label><label>И-мэйл<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label><label>Нууц үг<input type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label><label>Алба<select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label><label>Дүр<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="employee">Ажилтан</option><option value="manager">Менежер</option><option value="super_admin">Супер админ</option></select></label></>}
    <div className="modal-actions full"><button type="button" className="btn btn-ghost" onClick={close}>Болих</button><button className="btn btn-primary" disabled={saving}>{saving ? <LoaderCircle className="spin" /> : 'Хадгалах'}</button></div>
  </form></Modal>;
}
