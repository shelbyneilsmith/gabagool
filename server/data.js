import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')
const DATA_FILE = join(DATA_DIR, 'cms.json')
const UPLOADS_DIR = join(DATA_DIR, 'uploads')

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true })

const DEFAULT_DATA = {
  bio: {
    title: 'So What About Gabagool',
    paragraphs: [
      'Gabagool is the solo project of Shelby Neil Smith — a 45-year-old tattooer, web developer, and dad who retreats to his basement to make the kind of noise that his family tolerates and his neighbors pretend not to hear.',
      "When he's not inking skin, pushing pixels, or keeping small humans alive, Shelby writes and records everything himself in a basement studio held together by duct tape, cheap beer, and spite. The songs are heavy, the lyrics are bleak, and somehow the whole thing is still pretty funny if you squint hard enough.",
      'Gabagool started in 2019 as a way to process the slow, creeping realization that adulthood is mostly just pretending you know what you\'re doing while everything quietly falls apart around you. Turns out that\'s a pretty universal feeling, and people started showing up.',
      'The debut EP, "Everything Is Fine (It\'s Not)", was recorded between client sessions and school pickups. The follow-up LP, "Meat Sweats", was written almost entirely after midnight because that\'s the only time the house is quiet enough to hear yourself think — which, honestly, is part of the problem.',
      'One guy. One basement. Zero excuses.',
    ],
  },
  releases: [],
  members: [],
  shows: [],
  merch: [
    {
      id: '1',
      name: 'Gabagool Logo Tee',
      description: 'Classic logo on black. Simple. Bleak. Machine washable.',
      price: '$16',
      category: 'T-Shirts',
      image: '/merch_logo_tee.jpg',
    },
    {
      id: '2',
      name: 'Gabagool Logo Enamel Pin',
      description: 'Hard enamel, black nickel plating, standard metal clasp back. Looks great on your jacket or your crumbling sense of self.',
      price: '$5',
      category: 'Enamel Pins',
      image: '/merch_enamel_pin.jpg',
    },
    {
      id: '3',
      name: 'Gabagool Logo Large Sticker',
      description: '4" sticker',
      price: '$2',
      category: 'Stickers',
      image: '/merch_sticker.jpg',
    },
    {
      id: '4',
      name: 'Gabagool Logo Small Sticker',
      description: '3" sticker',
      price: '$2',
      category: 'Stickers',
      image: '/merch_sticker.jpg',
    },
  ],
}

function read() {
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_DATA, null, 2))
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
}

function write(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export function getBio() {
  return read().bio
}

export function updateBio(bio) {
  const data = read()
  data.bio = bio
  write(data)
  return data.bio
}

export function getMerch() {
  return read().merch
}

export function addMerchItem(item) {
  const data = read()
  item.id = randomBytes(4).toString('hex')
  data.merch.push(item)
  write(data)
  return item
}

export function updateMerchItem(id, updates) {
  const data = read()
  const index = data.merch.findIndex((m) => m.id === id)
  if (index === -1) return null
  data.merch[index] = { ...data.merch[index], ...updates, id }
  write(data)
  return data.merch[index]
}

export function deleteMerchItem(id) {
  const data = read()
  const index = data.merch.findIndex((m) => m.id === id)
  if (index === -1) return false
  data.merch.splice(index, 1)
  write(data)
  return true
}

export function getReleases() {
  const data = read()
  return data.releases || []
}

export function addRelease(release) {
  const data = read()
  if (!data.releases) data.releases = []
  release.id = randomBytes(4).toString('hex')
  data.releases.push(release)
  write(data)
  return release
}

export function updateRelease(id, updates) {
  const data = read()
  if (!data.releases) data.releases = []
  const index = data.releases.findIndex((r) => r.id === id)
  if (index === -1) return null
  data.releases[index] = { ...data.releases[index], ...updates, id }
  write(data)
  return data.releases[index]
}

export function deleteRelease(id) {
  const data = read()
  if (!data.releases) data.releases = []
  const index = data.releases.findIndex((r) => r.id === id)
  if (index === -1) return false
  data.releases.splice(index, 1)
  write(data)
  return true
}

export function getMembers() {
  const data = read()
  return data.members || []
}

export function addMember(member) {
  const data = read()
  if (!data.members) data.members = []
  member.id = randomBytes(4).toString('hex')
  data.members.push(member)
  write(data)
  return member
}

export function updateMember(id, updates) {
  const data = read()
  if (!data.members) data.members = []
  const index = data.members.findIndex((m) => m.id === id)
  if (index === -1) return null
  data.members[index] = { ...data.members[index], ...updates, id }
  write(data)
  return data.members[index]
}

export function deleteMember(id) {
  const data = read()
  if (!data.members) data.members = []
  const index = data.members.findIndex((m) => m.id === id)
  if (index === -1) return false
  data.members.splice(index, 1)
  write(data)
  return true
}

export function getShows() {
  const data = read()
  return data.shows || []
}

export function addShow(show) {
  const data = read()
  if (!data.shows) data.shows = []
  show.id = randomBytes(4).toString('hex')
  data.shows.push(show)
  write(data)
  return show
}

export function updateShow(id, updates) {
  const data = read()
  if (!data.shows) data.shows = []
  const index = data.shows.findIndex((s) => s.id === id)
  if (index === -1) return null
  data.shows[index] = { ...data.shows[index], ...updates, id }
  write(data)
  return data.shows[index]
}

export function deleteShow(id) {
  const data = read()
  if (!data.shows) data.shows = []
  const index = data.shows.findIndex((s) => s.id === id)
  if (index === -1) return false
  data.shows.splice(index, 1)
  write(data)
  return true
}

export { UPLOADS_DIR }
