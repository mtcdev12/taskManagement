import * as service from './tasks.service.js';
import { commentSchema, isStatus, rejectSchema, taskSchema, taskUpdateSchema } from './tasks.validators.js';

export async function list(req, res) {
  const filters = {};
  if (req.query.department_id) filters.departmentId = Number(req.query.department_id);
  if (req.query.assignee_id) filters.assigneeId = Number(req.query.assignee_id);
  if (isStatus(req.query.status)) filters.status = req.query.status;
  if (req.query.from || req.query.to) filters.dueDate = { ...(req.query.from ? { gte: new Date(req.query.from) } : {}), ...(req.query.to ? { lte: new Date(req.query.to) } : {}) };
  res.json(await service.listTasks(req.user, filters));
}
export async function get(req, res) { res.json(await service.getTask(req.user, Number(req.params.id))); }
export async function create(req, res) { res.status(201).json(await service.createTask(req.user, taskSchema.parse(req.body))); }
export async function update(req, res) { res.json(await service.updateTask(req.user, Number(req.params.id), taskUpdateSchema.parse(req.body))); }
export async function start(req, res) { res.json(await service.startTask(req.user, Number(req.params.id))); }
export async function submit(req, res) { res.json(await service.submitTask(req.user, Number(req.params.id))); }
export async function approve(req, res) { res.json(await service.reviewTask(req.user, Number(req.params.id), true)); }
export async function reject(req, res) { const { reason } = rejectSchema.parse(req.body); res.json(await service.reviewTask(req.user, Number(req.params.id), false, reason)); }
export async function history(req, res) { res.json(await service.getHistory(req.user, Number(req.params.id))); }
export async function comment(req, res) { const { content } = commentSchema.parse(req.body); res.status(201).json(await service.addComment(req.user, Number(req.params.id), content)); }
