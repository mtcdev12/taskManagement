import { Router } from 'express';
import { Role } from '@prisma/client';
import { allowRoles } from '../../middleware/role.middleware.js';
import * as controller from './users.controller.js';

export const usersRouter = Router();
usersRouter.get('/', controller.list);
usersRouter.post('/', allowRoles(Role.super_admin), controller.create);
usersRouter.patch('/:id', allowRoles(Role.super_admin), controller.update);
