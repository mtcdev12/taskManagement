import { z } from 'zod';
import * as service from './departments.service.js';

const schema = z.object({ name: z.string().trim().min(2).max(100), description: z.string().trim().max(1000).optional().nullable() });
export async function list(req, res) { res.json(await service.listDepartments(req.user)); }
export async function create(req, res) { const data = schema.parse(req.body); res.status(201).json(await service.createDepartment(data)); }
export async function update(req, res) { const data = schema.parse(req.body); res.json(await service.updateDepartment(Number(req.params.id), data)); }
