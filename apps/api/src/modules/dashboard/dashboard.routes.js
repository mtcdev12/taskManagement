import { Router } from 'express';
import { summary } from './dashboard.controller.js';

export const dashboardRouter = Router();
dashboardRouter.get('/summary', summary);
