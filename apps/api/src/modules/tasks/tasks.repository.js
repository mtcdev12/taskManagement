import { prisma } from '../../config/db.js';
import { taskInclude } from '../../common/task-utils.js';

export const list = (where) => prisma.task.findMany({ where, include: taskInclude, orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }] });
export const find = (where) => prisma.task.findFirst({ where, include: taskInclude });
export const findRaw = (where) => prisma.task.findFirst({ where });
export const findAssignee = (id) => prisma.user.findUnique({ where: { id } });
export const create = (data, userId) => prisma.$transaction(async (tx) => {
  const task = await tx.task.create({ data });
  await tx.taskStatusHistory.create({ data: { taskId: task.id, fromStatus: null, toStatus: 'todo', changedById: userId, comment: 'Ажил үүсгэв' } });
  return tx.task.findUniqueOrThrow({ where: { id: task.id }, include: taskInclude });
});
export const update = (id, data) => prisma.task.update({ where: { id }, data, include: taskInclude });
export const transition = (taskId, fromStatus, toStatus, userId, comment, extra = {}) => prisma.$transaction(async (tx) => {
  await tx.taskStatusHistory.create({ data: { taskId, fromStatus, toStatus, changedById: userId, comment } });
  return tx.task.update({ where: { id: taskId }, data: { status: toStatus, ...extra }, include: taskInclude });
});
export const history = (taskId) => prisma.taskStatusHistory.findMany({ where: { taskId }, include: { changedBy: { select: { id: true, fullName: true } } }, orderBy: { changedAt: 'desc' } });
export const addComment = (taskId, userId, content) => prisma.taskComment.create({ data: { taskId, userId, content }, include: { user: { select: { id: true, fullName: true } } } });
