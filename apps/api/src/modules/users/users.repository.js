import { prisma } from '../../config/db.js';
import { publicUserSelect } from '../../common/task-utils.js';

export const list = (where) => prisma.user.findMany({ where, select: publicUserSelect, orderBy: { fullName: 'asc' } });
export const create = (data) => prisma.user.create({ data, select: publicUserSelect });
export const update = (id, data) => prisma.user.update({ where: { id }, data, select: publicUserSelect });
