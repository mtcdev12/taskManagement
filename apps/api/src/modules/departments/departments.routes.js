import { Router } from 'express';
import { Role } from '@prisma/client';
import { allowRoles } from '../../middleware/role.middleware.js';
import * as controller from './departments.controller.js';

export const departmentsRouter = Router();
departmentsRouter.get('/', controller.list);
departmentsRouter.post('/', allowRoles(Role.super_admin), controller.create);
departmentsRouter.put('/:id', allowRoles(Role.super_admin), controller.update);
