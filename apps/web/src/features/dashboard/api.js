import { api } from '../../api';

export const getSummary = (period, departmentId) => api(`/dashboard/summary?period=${period}${departmentId ? `&department_id=${departmentId}` : ''}`);
export const getDepartments = () => api('/departments');
