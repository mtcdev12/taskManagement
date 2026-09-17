import { useState } from 'react';
import { Login } from './features/auth/Login';
import { Shell } from './layout/Shell';

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('ajil_user') || 'null'));
  const [page, setPage] = useState(() => user?.role === 'employee' ? 'tasks' : 'dashboard');
  if (!user) return <Login onLogin={(nextUser) => { setUser(nextUser); setPage(nextUser.role === 'employee' ? 'tasks' : 'dashboard'); }} />;
  const logout = () => { localStorage.removeItem('ajil_token'); localStorage.removeItem('ajil_user'); setUser(null); };
  return <Shell user={user} page={page} setPage={setPage} logout={logout} />;
}
