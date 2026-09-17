import { useState } from 'react';
import { ArrowRight, Building2, Check, Eye, LoaderCircle, ShieldCheck, Sparkles, Users, XCircle } from 'lucide-react';
import { login } from './api';

export function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@ajil.mn', password: 'Demo123!' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const data = await login(form);
      localStorage.setItem('ajil_token', data.token); localStorage.setItem('ajil_user', JSON.stringify(data.user)); onLogin(data.user);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  const demo = (email) => setForm({ email, password: 'Demo123!' });
  return <main className="login-page">
    <section className="login-story">
      <div className="brand brand-light"><span className="brand-mark"><Check /></span><span>AJIL</span></div>
      <div className="story-copy"><span className="eyebrow"><Sparkles size={14} /> Багийн ажлын нэг цэг</span><h1>Ажлын явцыг<br />ил тод, <em>энгийн.</em></h1><p>Даалгавар хуваарилахаас эхлээд гүйцэтгэлийг батлах хүртэлх бүх урсгалыг нэг дороос.</p></div>
      <div className="story-preview"><div className="preview-head"><span>Энэ долоо хоног</span><span className="live-dot">Шууд</span></div><div className="preview-stats"><strong>32</strong><span>Нийт ажил</span><strong>78%</strong><span>Гүйцэтгэл</span></div><div className="preview-bars">{[38,58,44,82,70,94,76].map((height) => <i key={height} style={{ height: `${height}%` }} />)}</div></div>
      <small>© 2026 Ажлын удирдлагын систем · Мэдээлэл хамгаалагдсан</small>
    </section>
    <section className="login-panel"><form className="login-card" onSubmit={submit}>
      <div className="mobile-brand brand"><span className="brand-mark"><Check /></span><span>AJIL</span></div><span className="mini-label">ТАВТАЙ МОРИЛ</span><h2>Бүртгэлээрээ нэвтрэх</h2><p className="muted">Ажлын орчиндоо үргэлжлүүлэн нэвтэрнэ үү.</p>
      {error && <div className="alert error"><XCircle size={18} />{error}</div>}
      <label>И-мэйл хаяг<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
      <label>Нууц үг<div className="password-wrap"><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /><Eye size={18} /></div></label>
      <button className="btn btn-primary btn-wide" disabled={loading}>{loading ? <LoaderCircle className="spin" /> : <>Нэвтрэх <ArrowRight size={18} /></>}</button>
      <div className="demo-divider"><span>Демо эрхээр турших</span></div><div className="demo-users"><button type="button" onClick={() => demo('admin@ajil.mn')}><ShieldCheck />Админ</button><button type="button" onClick={() => demo('manager@ajil.mn')}><Building2 />Менежер</button><button type="button" onClick={() => demo('employee@ajil.mn')}><Users />Ажилтан</button></div><p className="demo-note">Бүх демо хэрэглэгчийн нууц үг: <b>Demo123!</b></p>
    </form></section>
  </main>;
}
