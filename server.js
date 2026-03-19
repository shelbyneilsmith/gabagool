import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'
import { getBio, updateBio, getMerch, addMerchItem, updateMerchItem, deleteMerchItem, getReleases, addRelease, updateRelease, deleteRelease, getMembers, addMember, updateMember, deleteMember, getShows, addShow, updateShow, deleteShow, UPLOADS_DIR } from './server/data.js'
import { login, requireAuth } from './server/auth.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json())

// Serve uploaded images
app.use('/uploads', express.static(UPLOADS_DIR))

// Image upload config
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      cb(null, randomBytes(8).toString('hex') + extname(file.originalname))
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp']
    cb(null, allowed.includes(extname(file.originalname).toLowerCase()))
  },
})

// --- Public API ---

app.get('/api/bio', (_req, res) => {
  res.json(getBio())
})

app.get('/api/merch', (_req, res) => {
  res.json(getMerch())
})

// --- Auth ---

app.post('/api/login', async (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'Password required' })
  const result = await login(password)
  if (result.error) return res.status(401).json(result)
  res.json(result)
})

// --- Protected API ---

app.put('/api/bio', requireAuth, (req, res) => {
  const { title, paragraphs } = req.body
  if (!title || !Array.isArray(paragraphs)) {
    return res.status(400).json({ error: 'Invalid bio data' })
  }
  res.json(updateBio({ title, paragraphs }))
})

app.post('/api/merch', requireAuth, (req, res) => {
  const { name, description, price, category, image } = req.body
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' })
  }
  res.json(addMerchItem({ name, description: description || '', price, category, image: image || '' }))
})

app.put('/api/merch/:id', requireAuth, (req, res) => {
  const result = updateMerchItem(req.params.id, req.body)
  if (!result) return res.status(404).json({ error: 'Item not found' })
  res.json(result)
})

app.delete('/api/merch/:id', requireAuth, (req, res) => {
  const deleted = deleteMerchItem(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Item not found' })
  res.json({ success: true })
})

app.post('/api/merch/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

// --- Releases API ---

app.get('/api/releases', (_req, res) => {
  res.json(getReleases())
})

app.post('/api/releases', requireAuth, (req, res) => {
  const { title, artwork, releaseDate, tracks } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  res.json(addRelease({ title, artwork: artwork || '', releaseDate: releaseDate || '', tracks: tracks || [] }))
})

app.put('/api/releases/:id', requireAuth, (req, res) => {
  const result = updateRelease(req.params.id, req.body)
  if (!result) return res.status(404).json({ error: 'Release not found' })
  res.json(result)
})

app.delete('/api/releases/:id', requireAuth, (req, res) => {
  const deleted = deleteRelease(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Release not found' })
  res.json({ success: true })
})

// --- Members API ---

app.get('/api/members', (_req, res) => {
  res.json(getMembers())
})

app.post('/api/members', requireAuth, (req, res) => {
  const { name, role, bio } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })
  res.json(addMember({ name, role: role || '', bio: bio || '' }))
})

app.put('/api/members/:id', requireAuth, (req, res) => {
  const result = updateMember(req.params.id, req.body)
  if (!result) return res.status(404).json({ error: 'Member not found' })
  res.json(result)
})

app.delete('/api/members/:id', requireAuth, (req, res) => {
  const deleted = deleteMember(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Member not found' })
  res.json({ success: true })
})

// --- Shows API ---

app.get('/api/shows', (_req, res) => {
  res.json(getShows())
})

app.post('/api/shows', requireAuth, (req, res) => {
  const { date, venue, city, ticketLink } = req.body
  if (!date || !venue) return res.status(400).json({ error: 'Date and venue are required' })
  res.json(addShow({ date, venue, city: city || '', ticketLink: ticketLink || '' }))
})

app.put('/api/shows/:id', requireAuth, (req, res) => {
  const result = updateShow(req.params.id, req.body)
  if (!result) return res.status(404).json({ error: 'Show not found' })
  res.json(result)
})

app.delete('/api/shows/:id', requireAuth, (req, res) => {
  const deleted = deleteShow(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Show not found' })
  res.json({ success: true })
})

// --- Serve frontend ---

const distPath = join(__dirname, 'dist')
app.use(express.static(distPath))
app.get('/{*path}', (_req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

const PORT = process.env.PORT || 5150
app.listen(PORT, () => {
  console.log(`Gabagool server running on port ${PORT}`)
})
