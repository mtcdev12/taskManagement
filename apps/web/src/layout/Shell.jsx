import { useEffect, useState } from 'react';
import { Bell, Building2, Check, ChevronDown, ClipboardCheck, ClipboardList, LayoutDashboard, ListTodo, LogOut, Menu, Users } from 'lucide-react';
import { Avatar } from '../shared/components/UI';
import { ROLE, cx } from '../shared/constants';
import { listTasks } from '../features/tasks/api';
import { Dashboard } from '../features/dashboard/Dashboard';
import { TasksPage } from '../features/tasks/TasksPage';
import { ReviewPage } from '../features/review/ReviewPage';
import { OrganizationPage } from '../features/organization/OrganizationPage';

export function Shell({ user, page, setPage, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const isEmployee = user.role === 'employee';
  useEffect(() => { if (!isEmployee) listTasks('submitted').then((items) => setReviewCount(items.length)).catch(() => {}); }, [isEmployee, page]);
  const nav = isEmployee ? [{ id: 'tasks', label: 'Миний ажлууд', icon: ListTodo }] : [
    { id: 'dashboard', label: 'Хяналтын самбар', icon: LayoutDashboard }, { id: 'tasks', label: 'Бүх ажлууд', icon: ClipboardList },
    { id: 'review', label: 'Шалгах ажлууд', icon: ClipboardCheck }, ...(user.role === 'super_admin' ? [{ id: 'organization', label: 'Байгууллага', icon: Users }] : []),
  ];
  const titles = { dashboard: ['Хяналтын самбар', 'Багийн ажлын гүйцэтгэлийн нэгдсэн мэдээлэл'], tasks: [isEmployee ? 'Миний ажлууд' : 'Ажлын жагсаалт', isEmployee ? 'Танд оноогдсон ажлын явцаа удирдана уу' : 'Ажлуудыг хуваарилж, явцыг хянана уу'], review: ['Шалгах ажлууд', 'Гүйцэтгэлийг шалгаж, шийдвэрлэнэ үү'], organization: ['Байгууллага', 'Алба болон хэрэглэгчдийн удирдлага'] };
  return <div className="app-shell">
    <aside className={cx('sidebar', menuOpen && 'open')}>
      <div className="brand"><span className="brand-mark"><Check /></span><span>AJIL</span></div>
      <nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={page === id ? 'active' : ''} onClick={() => { setPage(id); setMenuOpen(false); }}><Icon size={19} /><span>{label}</span>{id === 'review' && reviewCount > 0 && <b className="nav-count">{reviewCount}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="user-tile"><Avatar name={user.fullName} /><div><strong>{user.fullName}</strong><span>{ROLE[user.role]}</span></div><button onClick={logout} title="Гарах"><LogOut size={17} /></button></div></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button><div><h1>{titles[page]?.[0]}</h1><p>{titles[page]?.[1]}</p></div><div className="top-actions"><button className="icon-btn notification"><Bell size={19} /><i /></button><div className="top-profile"><Avatar name={user.fullName} /><span>{user.fullName.split(' ')[0]}</span><ChevronDown size={15} /></div></div></header>
      <main className="content">{page === 'dashboard' && <Dashboard user={user} setPage={setPage} />}{page === 'tasks' && <TasksPage user={user} />}{page === 'review' && <ReviewPage />}{page === 'organization' && <OrganizationPage />}</main>
    </div>
    {menuOpen && <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />}
  </div>;
}
