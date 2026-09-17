import { Router } from 'express';
import { Role } from '@prisma/client';
import { allowRoles } from '../../middleware/role.middleware.js';
import * as controller from './tasks.controller.js';

export const tasksRouter = Router();
tasksRouter.get('/', controller.list);
tasksRouter.post('/', allowRoles(Role.super_admin, Role.manager), controller.create);
tasksRouter.post('/:id/start', allowRoles(Role.employee), controller.start);
tasksRouter.post('/:id/submit', allowRoles(Role.employee), controller.submit);
tasksRouter.post('/:id/approve', allowRoles(Role.super_admin, Role.manager), controller.approve);
tasksRouter.post('/:id/reject', allowRoles(Role.super_admin, Role.manager), controller.reject);
tasksRouter.get('/:id/history', controller.history);
tasksRouter.post('/:id/comments', controller.comment);
tasksRouter.get('/:id', controller.get);
tasksRouter.patch('/:id', allowRoles(Role.super_admin, Role.manager), controller.update);
