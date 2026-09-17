import { Role } from '@prisma/client';
import { z } from 'zod';
import * as service from './users.service.js';

const createSchema = z.object({ fullName: z.string().trim().min(2).max(150), email: z.string().email(), password: z.string().min(6), role: z.nativeEnum(Role), departmentId: z.number().int().positive().nullable() });
const updateSchema = z.object({ fullName: z.string().trim().min(2).max(150).optional(), role: z.nativeEnum(Role).optional(), departmentId: z.number().int().positive().nullable().optional(), isActive: z.boolean().optional() });

export async function list(req, res) { res.json(await service.listUsers(req.user, req.query.department_id ? Number(req.query.department_id) : undefined)); }
export async function create(req, res) { res.status(201).json(await service.createUser(createSchema.parse(req.body))); }
export async function update(req, res) { res.json(await service.updateUser(Number(req.params.id), updateSchema.parse(req.body))); }
