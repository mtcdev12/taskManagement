import { useEffect, useState } from 'react';
import { Activity, ArrowRight, ClipboardList, Clock3, Plus, XCircle } from 'lucide-react';
import { Loading, PanelHead } from '../../shared/components/UI';
import { STATUS } from '../../shared/constants';
import { TaskTable } from '../tasks/TaskTable';
import { getDepartments, getSummary } from './api';

export function Dashboard({ user, setPage }) {
  const [period, setPeriod] = useState('week'); const [departmentId, setDepartmentId] = useState(''); const [summary, setSummary] = useState(null); const [departments, setDepartments] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { getDepartments().then(setDepartments).catch(() => {}); }, []);
  useEffect(() => { setLoading(true); getSummary(period, departmentId).then(setSummary).finally(() => setLoading(false)); }, [period, departmentId]);
  const c = summary?.counts || {};
  const cards = [
    { label: 'Нийт ажил', value: c.all || 0, icon: ClipboardList, tone: 'indigo', sub: 'Сонгосон хугацаанд' },
    { label: 'Хийгдэж буй', value: c.in_progress || 0, icon: Activity, tone: 'blue', sub: 'Идэвхтэй ажил' },
    { label: 'Шалгуулах', value: c.submitted || 0, icon: Clock3, tone: 'amber', sub: 'Таны шийдвэр хүлээж буй' },
    { label: 'Хугацаа хэтэрсэн', value: c.overdue || 0, icon: XCircle, tone: 'red', sub: 'Анхаарах шаардлагатай' },
  ];
  return <div className="page-stack">
    <div className="page-tools"><div className="filters">{user.role === 'super_admin' && <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}><option value="">Бүх алба</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>}<select value={period} onChange={(e) => setPeriod(e.target.value)}><option value="week">7 хоног</option><option value="biweekly">14 хоног</option><option value="month">30 хоног</option></select></div><button className="btn btn-primary" onClick={() => setPage('tasks')}><Plus size={17} /> Шинэ ажил</button></div>
    {loading ? <Loading /> : <><section className="stat-grid">{cards.map(({ label, value, icon: Icon, tone, sub }) => <article className="stat-card" key={label}><div className={`stat-icon ${tone}`}><Icon size={21} /></div><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}</section>
      <section className="dashboard-grid"><article className="panel performance-panel"><PanelHead title="Гүйцэтгэлийн тойм" subtitle="Сонгосон хугацааны ажлын харьцаа" /><div className="performance-body"><div className="donut" style={{ '--value': `${summary?.completionRate || 0}%` }}><div><strong>{summary?.completionRate || 0}%</strong><span>Гүйцэтгэл</span></div></div><div className="legend"><Legend color="green" label="Батлагдсан" value={c.approved} total={c.all} /><Legend color="blue" label="Хийгдэж буй" value={c.in_progress} total={c.all} /><Legend color="amber" label="Шалгуулах" value={c.submitted} total={c.all} /><Legend color="gray" label="Хийгдээгүй" value={c.todo} total={c.all} /></div></div></article>
        <article className="panel activity-panel"><PanelHead title="Ажлын ачаалал" subtitle="Төлөв тус бүрийн тоо" /><div className="bar-chart">{['todo', 'in_progress', 'submitted', 'approved'].map((key) => <div key={key}><span>{STATUS[key].label}</span><div><i className={STATUS[key].className} style={{ width: `${Math.max(8, ((c[key] || 0) / Math.max(c.all || 1, 1)) * 100)}%` }} /></div><b>{c[key] || 0}</b></div>)}</div></article></section>
      <section className="panel"><PanelHead title="Ойрын хугацаатай ажлууд" subtitle="Анхаарах шаардлагатай дараагийн ажлууд" action={<button className="text-btn" onClick={() => setPage('tasks')}>Бүгдийг харах <ArrowRight size={15} /></button>} /><TaskTable tasks={(summary?.tasks || []).slice(0, 6)} compact /></section></>}
  </div>;
}

function Legend({ color, label, value = 0, total = 0 }) { return <div><i className={color} /><span>{label}</span><b>{value}</b><small>{total ? Math.round(value / total * 100) : 0}%</small></div>; }
