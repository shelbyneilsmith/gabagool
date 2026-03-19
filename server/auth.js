import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

export async function login(password) {
  if (!ADMIN_PASSWORD_HASH) {
    return { error: 'Admin password not configured' }
  }
  const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
  if (!valid) {
    return { error: 'Invalid password' }
  }
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' })
  return { token }
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    jwt.verify(header.slice(7), JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
