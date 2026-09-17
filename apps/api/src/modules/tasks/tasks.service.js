import { Role, TaskStatus } from '@prisma/client';
import { AppError } from '../../common/errors.js';
import { withComputedTask } from '../../common/task-utils.js';
import * as repository from './tasks.repository.js';

export function taskScope(user) {
  if (user.role === Role.super_admin) return {};
  if (user.role === Role.manager) return { departmentId: user.departmentId ?? -1 };
  return { assigneeId: user.id };
}

export async function listTasks(user, filters) {
  const where = { ...filters, ...taskScope(user) };
  return (await repository.list(where)).map(withComputedTask);
}

export async function getTask(user, id) {
  const task = await repository.find({ id, ...taskScope(user) });
  if (!task) throw new AppError(404, 'Ажил олдсонгүй.');
  return withComputedTask(task);
}

export async function createTask(user, data) {
  assertDepartment(user, data.departmentId);
  const assignee = data.assigneeId ? await repository.findAssignee(data.assigneeId) : null;
  if (assignee && assignee.departmentId !== data.departmentId) throw new AppError(400, 'Ажилтан сонгосон албанд харьяалагдахгүй байна.');
  const { dueDate, ...rest } = data;
  return withComputedTask(await repository.create({ ...rest, dueDate: dueDate ? new Date(dueDate) : null, createdById: user.id }, user.id));
}

export async function updateTask(user, id, data) {
  const existing = await repository.findRaw({ id, ...taskScope(user) });
  if (!existing) throw new AppError(404, 'Ажил олдсонгүй.');
  if ([TaskStatus.submitted, TaskStatus.approved].includes(existing.status)) throw new AppError(409, 'Шалгалтад орсон ажлыг засах боломжгүй.');
  if (data.departmentId) assertDepartment(user, data.departmentId);
  if (data.assigneeId) {
    const assignee = await repository.findAssignee(data.assigneeId);
    if (!assignee || assignee.departmentId !== (data.departmentId ?? existing.departmentId)) throw new AppError(400, 'Ажилтан сонгосон албанд харьяалагдахгүй байна.');
  }
  const { dueDate, ...rest } = data;
  return withComputedTask(await repository.update(id, { ...rest, ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}) }));
}

export async function startTask(user, id) {
  const task = await repository.findRaw({ id, assigneeId: user.id });
  if (!task) throw new AppError(404, 'Ажил олдсонгүй.');
  if (![TaskStatus.todo, TaskStatus.rejected].includes(task.status)) throw new AppError(409, 'Энэ ажлыг эхлүүлэх боломжгүй төлөвтэй байна.');
  return withComputedTask(await repository.transition(id, task.status, TaskStatus.in_progress, user.id, task.status === TaskStatus.rejected ? 'Буцаагдсан ажлыг дахин эхлүүлэв' : 'Ажил эхлүүлэв'));
}

export async function submitTask(user, id) {
  const task = await repository.findRaw({ id, assigneeId: user.id });
  if (!task) throw new AppError(404, 'Ажил олдсонгүй.');
  if (task.status !== TaskStatus.in_progress) throw new AppError(409, 'Зөвхөн хийж байгаа ажлыг шалгуулахаар илгээнэ.');
  return withComputedTask(await repository.transition(id, task.status, TaskStatus.submitted, user.id, 'Шалгуулахаар илгээв', { submittedAt: new Date(), rejectionReason: null }));
}

export async function reviewTask(user, id, approved, reason) {
  const task = await repository.findRaw({ id, status: TaskStatus.submitted, ...taskScope(user) });
  if (!task) throw new AppError(404, 'Шалгах ажил олдсонгүй.');
  const status = approved ? TaskStatus.approved : TaskStatus.rejected;
  const comment = approved ? 'Гүйцэтгэлийг батлав' : reason;
  return withComputedTask(await repository.transition(id, task.status, status, user.id, comment, { reviewedAt: new Date(), reviewedById: user.id, ...(!approved ? { rejectionReason: reason } : {}) }));
}

export async function getHistory(user, id) { await getTask(user, id); return repository.history(id); }
export async function addComment(user, id, content) { await getTask(user, id); return repository.addComment(id, user.id, content); }

function assertDepartment(user, departmentId) {
  if (user.role === Role.manager && user.departmentId !== departmentId) throw new AppError(403, 'Зөвхөн өөрийн албанд ажил үүсгэх боломжтой.');
}
