import { prisma } from '../../config/db.js';
import { publicUserSelect } from '../../common/task-utils.js';

export const findUserByEmail = (email) => prisma.user.findUnique({ where: { email }, include: { department: { select: { id: true, name: true } } } });
export const findPublicUser = (id) => prisma.user.findUnique({ where: { id }, select: publicUserSelect });
