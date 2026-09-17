import { useEffect, useState } from 'react';
import { Building2, CalendarDays, Check, CheckCircle2, Clock3, X } from 'lucide-react';
import { Avatar, Empty, Loading, Modal, StatusPill, Toast } from '../../shared/components/UI';
import { formatDate } from '../../shared/constants';
import { approveTask, listTasks, rejectTask as sendRejection } from '../tasks/api';

export function ReviewPage() {
  const [tasks, setTasks] = useState([]); const [loading, setLoading] = useState(true); const [rejectTask, setRejectTask] = useState(null); const [reason, setReason] = useState(''); const [notice, setNotice] = useState('');
  const load = () => { setLoading(true); listTasks('submitted').then(setTasks).finally(() => setLoading(false)); };
  useEffect(load, []);
  const approve = async (task) => { try { await approveTask(task.id); setNotice('Гүйцэтгэл амжилттай батлагдлаа.'); load(); } catch (err) { setNotice(err.message); } };
  const reject = async () => { try { await sendRejection(rejectTask.id, reason); setRejectTask(null); setReason(''); setNotice('Ажил засварлуулахаар буцаагдлаа.'); load(); } catch (err) { setNotice(err.message); } };
  return <div className="page-stack">
    {notice && <Toast text={notice} close={() => setNotice('')} />}
    <div className="review-summary"><div><span className="stat-icon amber"><Clock3 /></span><div><strong>{tasks.length}</strong><p>Таны шийдвэр хүлээж буй ажил</p></div></div><span>Илгээсэн дарааллаар эрэмбэлэв</span></div>
    {loading ? <Loading /> : tasks.length ? <div className="review-grid">{tasks.map((task) => <article className="review-card" key={task.id}>
      <div className="review-top"><StatusPill task={task} /><span>{formatDate(task.submittedAt)} илгээсэн</span></div><h3>{task.title}</h3><p>{task.description || 'Тайлбар оруулаагүй.'}</p>
      <div className="review-meta"><div><Avatar name={task.assignee?.fullName} /><span><small>Гүйцэтгэгч</small><b>{task.assignee?.fullName}</b></span></div><div><Building2 size={17} /><span><small>Алба</small><b>{task.department.name}</b></span></div><div><CalendarDays size={17} /><span><small>Хугацаа</small><b>{formatDate(task.dueDate)}</b></span></div></div>
      <div className="review-actions"><button className="btn btn-ghost danger" onClick={() => setRejectTask(task)}><X size={16} /> Буцаах</button><button className="btn btn-success" onClick={() => approve(task)}><Check size={17} /> Батлах</button></div>
    </article>)}</div> : <div className="panel"><Empty icon={CheckCircle2} title="Шалгах ажил алга" text="Бүх илгээсэн ажлыг шийдвэрлэсэн байна. Сайн байна!" /></div>}
    {rejectTask && <Modal title="Ажлыг буцаах" subtitle={rejectTask.title} close={() => setRejectTask(null)}><div className="modal-form"><label className="full">Буцаах шалтгаан<textarea rows="5" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Засах шаардлагатай зүйлсийг тодорхой бичнэ үү..." /></label><div className="modal-actions full"><button className="btn btn-ghost" onClick={() => setRejectTask(null)}>Болих</button><button className="btn btn-danger" onClick={reject} disabled={reason.trim().length < 3}>Буцаах</button></div></div></Modal>}
  </div>;
}
