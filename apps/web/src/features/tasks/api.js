import { api } from '../../api';

export const listTasks = (status = '') => api(`/tasks${status ? `?status=${status}` : ''}`);
export const createTask = (data) => api('/tasks', { method: 'POST', body: JSON.stringify(data) });
export const startTask = (id) => api(`/tasks/${id}/start`, { method: 'POST' });
export const submitTask = (id) => api(`/tasks/${id}/submit`, { method: 'POST' });
export const approveTask = (id) => api(`/tasks/${id}/approve`, { method: 'POST' });
export const rejectTask = (id, reason) => api(`/tasks/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) });
export const listDepartments = () => api('/departments');
export const listUsers = (departmentId = '') => api(`/users${departmentId ? `?department_id=${departmentId}` : ''}`);
