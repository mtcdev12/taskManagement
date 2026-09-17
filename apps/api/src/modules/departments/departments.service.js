import { Role } from '@prisma/client';
import * as repository from './departments.repository.js';

export const listDepartments = (user) => repository.list(user.role === Role.super_admin ? {} : { id: user.departmentId ?? -1 });
export const createDepartment = (data) => repository.create(data);
export const updateDepartment = (id, data) => repository.update(id, data);
