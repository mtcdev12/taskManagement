import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'development-only-secret';

export const signToken = (user) => jwt.sign(user, secret, { expiresIn: '8h' });

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Нэвтрэх шаардлагатай.' });
  try {
    req.user = jwt.verify(header.slice(7), secret);
    next();
  } catch {
    res.status(401).json({ message: 'Нэвтрэх хугацаа дууссан байна.' });
  }
}
