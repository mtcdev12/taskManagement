import { useState } from 'react';
import { Filter, MoreHorizontal, Plus, Search } from 'lucide-react';
import { Loading, Toast } from '../../shared/components/UI';
import { STATUS } from '../../shared/constants';
import { startTask, submitTask } from './api';
import { useTasks } from './useTasks';
import { TaskModal } from './TaskModal';
import { TaskTable } from './TaskTable';

export function TasksPage({ user }) {
  const [status, setStatus] = useState(''); const [query, setQuery] = useState(''); const [modal, setModal] = useState(false); const [notice, setNotice] = useState('');
  const { tasks, shown, loading, load } = useTasks(status, query);
  const action = async (task, type) => { try { await (type === 'start' ? startTask(task.id) : submitTask(task.id)); setNotice(type === 'start' ? 'Ажил эхэлсэн төлөвт шилжлээ.' : 'Ажлыг шалгуулахаар илгээлээ.'); load(); } catch (err) { setNotice(err.message); } };
  return <div className="page-stack">
    {notice && <Toast text={notice} close={() => setNotice('')} />}
    <div className="page-tools"><div className="search"><Search size={18} /><input placeholder="Ажлын нэрээр хайх..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>{user.role !== 'employee' && <button className="btn btn-primary" onClick={() => setModal(true)}><Plus size={17} /> Шинэ ажил</button>}</div>
    <div className="status-tabs"><button className={!status ? 'active' : ''} onClick={() => setStatus('')}>Бүгд <b>{tasks.length}</b></button>{Object.entries(STATUS).map(([key, item]) => <button key={key} className={status === key ? 'active' : ''} onClick={() => setStatus(key)}>{item.label}</button>)}</div>
    <section className="panel task-list-panel"><div className="list-toolbar"><span><Filter size={16} /> {shown.length} ажил</span><button className="icon-btn"><MoreHorizontal /></button></div>{loading ? <Loading /> : <TaskTable tasks={shown} employee={user.role === 'employee'} onAction={action} />}</section>
    {modal && <TaskModal user={user} close={() => setModal(false)} saved={() => { setModal(false); setNotice('Шинэ ажил амжилттай үүслээ.'); load(); }} />}
  </div>;
}
