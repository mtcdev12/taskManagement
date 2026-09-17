import * as service from './dashboard.service.js';

export async function summary(req, res) {
  res.json(await service.getSummary(req.user, String(req.query.period || 'week'), req.query.department_id ? Number(req.query.department_id) : undefined));
}
