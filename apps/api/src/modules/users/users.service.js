import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import * as repository from './users.repository.js';

export function listUsers(requester, departmentId) {
  const scope = requester.role === Role.super_admin ? departmentId : requester.departmentId ?? -1;
  return repository.list({ ...(scope ? { departmentId: scope } : {}), isActive: true });
}

export async function createUser(data) {
  const { password, ...user } = data;
  return repository.create({ ...user, email: user.email.toLowerCase(), passwordHash: await bcrypt.hash(password, 12) });
}
export const updateUser = (id, data) => repository.update(id, data);
