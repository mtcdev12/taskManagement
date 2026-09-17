import { useEffect } from 'react';
import { CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { STATUS, cx, initials } from '../constants';

export function Avatar({ name, small }) { return <span className={cx('avatar', small && 'small')}>{initials(name)}</span>; }
export function StatusPill({ task }) { const item = task.isOverdue ? { label: 'Хугацаа хэтэрсэн', className: 'red' } : STATUS[task.status]; return <span className={`status ${item.className}`}><i />{item.label}</span>; }
export function Loading() { return <div className="loading"><LoaderCircle className="spin" /><span>Уншиж байна...</span></div>; }
export function Empty({ icon: Icon, title, text }) { return <div className="empty"><span><Icon /></span><h3>{title}</h3><p>{text}</p></div>; }
export function PanelHead({ title, subtitle, action }) { return <header className="panel-head"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</header>; }
export function Modal({ title, subtitle, close, children }) { return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}><section className="modal"><header><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-btn" onClick={close}><X /></button></header>{children}</section></div>; }
export function Toast({ text, close }) { useEffect(() => { const id = setTimeout(close, 3500); return () => clearTimeout(id); }, [close]); return <div className="toast"><CheckCircle2 size={19} /><span>{text}</span><button onClick={close}><X size={15} /></button></div>; }
