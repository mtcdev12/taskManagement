import { Priority, TaskStatus } from '@prisma/client';
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  departmentId: z.number().int().positive(),
  assigneeId: z.number().int().positive().optional().nullable(),
  priority: z.nativeEnum(Priority).default(Priority.normal),
  dueDate: z.string().date().optional().nullable(),
});
export const taskUpdateSchema = taskSchema.partial();
export const rejectSchema = z.object({ reason: z.string().trim().min(3).max(2000) });
export const commentSchema = z.object({ content: z.string().trim().min(1).max(2000) });
export const isStatus = (value) => Object.values(TaskStatus).includes(value);
