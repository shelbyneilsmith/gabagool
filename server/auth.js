import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set')
  process.exit(1)
}
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

// Simple in-memory rate limiter for login attempts
const loginAttempts = new Map()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export function loginRateLimit(req, res, next) {
  const ip = req.ip
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (record) {
    // Clean up expired entries
    if (now - record.start > WINDOW_MS) {
      loginAttempts.delete(ip)
    } else if (record.count >= MAX_ATTEMPTS) {
      const retryAfter = Math.ceil((record.start + WINDOW_MS - now) / 1000)
      return res.status(429).json({ error: `Too many login attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` })
    }
  }
  next()
}

export function recordLoginFailure(ip) {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now - record.start > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, start: now })
  } else {
    record.count++
  }
}

export function clearLoginAttempts(ip) {
  loginAttempts.delete(ip)
}

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
