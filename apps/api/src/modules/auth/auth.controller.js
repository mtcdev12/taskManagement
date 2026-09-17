import { z } from 'zod';
import * as service from './auth.service.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: 'И-мэйл болон нууц үгээ зөв оруулна уу.' });
  res.json(await service.login(parsed.data.email, parsed.data.password));
}

export const logout = (_req, res) => res.status(204).send();
export async function me(req, res) { res.json(await service.getMe(req.user.id)); }
