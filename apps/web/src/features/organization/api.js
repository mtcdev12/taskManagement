import { api } from '../../api';

export const listDepartments = () => api('/departments');
export const listUsers = () => api('/users');
export const createDepartment = (data) => api('/departments', { method: 'POST', body: JSON.stringify(data) });
export const createUser = (data) => api('/users', { method: 'POST', body: JSON.stringify(data) });
