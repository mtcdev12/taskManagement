import { CalendarDays, ClipboardList, Send } from 'lucide-react';
import { Avatar, Empty, StatusPill } from '../../shared/components/UI';
import { PRIORITY, formatDate } from '../../shared/constants';

export function TaskTable({ tasks, employee = false, onAction, compact = false }) {
  if (!tasks.length) return <Empty icon={ClipboardList} title="Ажил олдсонгүй" text="Сонгосон нөхцөлд тохирох ажил алга байна." />;
  return <div className="table-wrap"><table className="task-table"><thead><tr><th>Ажил</th><th>Хариуцагч</th><th>Хугацаа</th><th>Эрэмбэ</th><th>Төлөв</th>{!compact && <th />}</tr></thead><tbody>{tasks.map((task) => <tr key={task.id}>
    <td><div className="task-title-cell"><i className={`priority-line ${task.priority}`} /><div><strong>{task.title}</strong><span>{task.department.name}</span></div></div></td>
    <td>{task.assignee ? <div className="person"><Avatar name={task.assignee.fullName} small /><span>{task.assignee.fullName}</span></div> : <span className="muted">Оноогоогүй</span>}</td>
    <td><span className={task.isOverdue ? 'date overdue' : 'date'}><CalendarDays size={15} />{formatDate(task.dueDate)}</span></td><td><span className={`priority ${task.priority}`}>{PRIORITY[task.priority]}</span></td><td><StatusPill task={task} /></td>
    {!compact && <td className="action-cell">{employee && (task.status === 'todo' || task.status === 'rejected') && <button className="btn btn-small btn-soft" onClick={() => onAction(task, 'start')}>Эхлүүлэх</button>}{employee && task.status === 'in_progress' && <button className="btn btn-small btn-primary" onClick={() => onAction(task, 'submit')}><Send size={14} /> Илгээх</button>}</td>}
  </tr>)}</tbody></table></div>;
}
