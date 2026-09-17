export const STATUS = {
  todo: { label: 'Хийгдээгүй', className: 'neutral' },
  in_progress: { label: 'Хийгдэж буй', className: 'blue' },
  submitted: { label: 'Шалгуулах', className: 'amber' },
  approved: { label: 'Батлагдсан', className: 'green' },
  rejected: { label: 'Буцаагдсан', className: 'red' },
};
export const PRIORITY = { urgent: 'Яаралтай', normal: 'Энгийн', low: 'Бага' };
export const ROLE = { super_admin: 'Супер админ', manager: 'Хэлтсийн менежер', employee: 'Ажилтан' };
export const cx = (...names) => names.filter(Boolean).join(' ');
export const formatDate = (value) => value ? new Intl.DateTimeFormat('mn-MN', { month: 'short', day: 'numeric' }).format(new Date(value)) : 'Хугацаагүй';
export const initials = (name = '') => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
