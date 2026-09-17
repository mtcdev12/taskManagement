import { TaskStatus } from '@prisma/client';

export const publicUserSelect = {
  id: true, fullName: true, email: true, role: true, departmentId: true, isActive: true,
  department: { select: { id: true, name: true } },
};

export const taskInclude = {
  department: { select: { id: true, name: true } },
  assignee: { select: { id: true, fullName: true, email: true } },
  createdBy: { select: { id: true, fullName: true } },
};

export function withComputedTask(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = Boolean(task.dueDate && new Date(task.dueDate) < today && [TaskStatus.todo, TaskStatus.in_progress].includes(task.status));
  return { ...task, isOverdue };
}

export function periodRange(period = 'week') {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  const from = new Date(to);
  from.setHours(0, 0, 0, 0);
  from.setDate(from.getDate() - (period === 'month' ? 29 : period === 'biweekly' ? 13 : 6));
  return { from, to };
}
