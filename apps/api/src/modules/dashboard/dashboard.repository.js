import { prisma } from '../../config/db.js';
import { taskInclude } from '../../common/task-utils.js';

export const list = (where) => prisma.task.findMany({ where, include: taskInclude, orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }] });
