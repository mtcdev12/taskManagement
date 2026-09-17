import { useEffect, useState } from 'react';
import { Building2, ClipboardList, MoreHorizontal, Plus, Users } from 'lucide-react';
import { Avatar, Toast } from '../../shared/components/UI';
import { ROLE } from '../../shared/constants';
import { listDepartments, listUsers } from './api';
import { OrganizationModal } from './OrganizationModal';

export function OrganizationPage() {
  const [tab, setTab] = useState('departments'); const [departments, setDepartments] = useState([]); const [users, setUsers] = useState([]); const [modal, setModal] = useState(null); const [notice, setNotice] = useState('');
  const load = () => { listDepartments().then(setDepartments); listUsers().then(setUsers); };
  useEffect(load, []);
  return <div className="page-stack">
    {notice && <Toast text={notice} close={() => setNotice('')} />}
    <div className="page-tools"><div className="segmented"><button className={tab === 'departments' ? 'active' : ''} onClick={() => setTab('departments')}>Алба, хэлтэс</button><button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Хэрэглэгчид</button></div><button className="btn btn-primary" onClick={() => setModal(tab === 'departments' ? 'department' : 'user')}><Plus size={17} /> {tab === 'departments' ? 'Алба нэмэх' : 'Хэрэглэгч нэмэх'}</button></div>
    {tab === 'departments' ? <div className="department-grid">{departments.map((department, index) => <article className="department-card" key={department.id}><span className={`department-icon tone-${index % 4}`}><Building2 /></span><button className="icon-btn"><MoreHorizontal /></button><h3>{department.name}</h3><p>{department.description || 'Тайлбар оруулаагүй'}</p><div><span><Users size={16} /> {department._count?.users || 0} ажилтан</span><span><ClipboardList size={16} /> {department._count?.tasks || 0} ажил</span></div></article>)}</div> : <section className="panel"><div className="table-wrap"><table className="user-table"><thead><tr><th>Хэрэглэгч</th><th>Алба</th><th>Дүр</th><th>Төлөв</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td><div className="person"><Avatar name={user.fullName} /><span><b>{user.fullName}</b><small>{user.email}</small></span></div></td><td>{user.department?.name || '—'}</td><td>{ROLE[user.role]}</td><td><span className="active-status"><i />Идэвхтэй</span></td></tr>)}</tbody></table></div></section>}
    {modal && <OrganizationModal type={modal} departments={departments} close={() => setModal(null)} saved={() => { setModal(null); setNotice('Мэдээлэл амжилттай нэмэгдлээ.'); load(); }} />}
  </div>;
}
