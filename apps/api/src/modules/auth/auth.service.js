import bcrypt from 'bcryptjs';
import { AppError } from '../../common/errors.js';
import { signToken } from '../../middleware/auth.middleware.js';
import { findPublicUser, findUserByEmail } from './auth.repository.js';

export async function login(email, password) {
  const user = await findUserByEmail(email.toLowerCase());
  if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError(401, 'И-мэйл эсвэл нууц үг буруу байна.');
  const payload = { id: user.id, email: user.email, role: user.role, departmentId: user.departmentId };
  const { passwordHash: _, ...safeUser } = user;
  return { token: signToken(payload), user: safeUser };
}

export async function getMe(id) {
  const user = await findPublicUser(id);
  if (!user?.isActive) throw new AppError(401, 'Хэрэглэгч идэвхгүй байна.');
  return user;
}
