import { Role, TaskStatus } from '@prisma/client';
import { periodRange, withComputedTask } from '../../common/task-utils.js';
import * as repository from './dashboard.repository.js';

export async function getSummary(user, period, departmentId) {
  const range = periodRange(period);
  const scope = user.role === Role.super_admin ? departmentId ? { departmentId } : {} : user.role === Role.manager ? { departmentId: user.departmentId ?? -1 } : { assigneeId: user.id };
  const tasks = (await repository.list({ ...scope, dueDate: { gte: range.from, lte: range.to } })).map(withComputedTask);
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === TaskStatus.todo).length,
    in_progress: tasks.filter((t) => t.status === TaskStatus.in_progress).length,
    submitted: tasks.filter((t) => t.status === TaskStatus.submitted).length,
    approved: tasks.filter((t) => t.status === TaskStatus.approved).length,
    rejected: tasks.filter((t) => t.status === TaskStatus.rejected).length,
    overdue: tasks.filter((t) => t.isOverdue).length,
  };
  return { period: range, counts, completionRate: counts.all ? Math.round(counts.approved / counts.all * 100) : 0, tasks };
}
