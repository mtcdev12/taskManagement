import { prisma } from '../../config/db.js';

export const list = (where) => prisma.department.findMany({ where, include: { _count: { select: { users: true, tasks: true } } }, orderBy: { name: 'asc' } });
export const create = (data) => prisma.department.create({ data });
export const update = (id, data) => prisma.department.update({ where: { id }, data });
