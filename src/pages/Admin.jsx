import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function api(path, options = {}) {
  const token = localStorage.getItem('admin_token')
  return fetch(path, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body && !(options.body instanceof FormData)
        ? { 'Content-Type': 'application/json' }
        : {}),
    },
  })
}

function Admin() {
  const navigate = useNavigate()
  const [bio, setBio] = useState(null)
  const [bioText, setBioText] = useState('')
  const [merch, setMerch] = useState(null)
  const [releases, setReleases] = useState(null)
  const [members, setMembers] = useState(null)
  const [shows, setShows] = useState(null)
  const CATEGORIES = ['T-Shirts', 'Enamel Pins', 'Stickers']
  const [tab, setTab] = useState('bio')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin/login')
      return
    }
    Promise.all([
      api('/api/bio').then((r) => (r.ok ? r.json() : Promise.reject())),
      api('/api/merch').then((r) => (r.ok ? r.json() : Promise.reject())),
      api('/api/releases').then((r) => (r.ok ? r.json() : Promise.reject())),
      api('/api/members').then((r) => (r.ok ? r.json() : Promise.reject())),
      api('/api/shows').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([bioData, merchData, releasesData, membersData, showsData]) => {
        setBio(bioData)
        setBioText(bioData.paragraphs.join('\n\n'))
        setMerch(merchData)
        setReleases(releasesData)
        setMembers(membersData)
        setShows(showsData)
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        navigate('/admin/login')
      })
  }, [navigate])

  function flash(msg) {
    setMessage(msg)
    setTimeout(() => setMessage(null), 3000)
  }

  async function saveBio() {
    setSaving(true)
    const paragraphs = bioText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    const updated = { ...bio, paragraphs }
    const res = await api('/api/bio', { method: 'PUT', body: JSON.stringify(updated) })
    if (res.ok) {
      setBio(updated)
      flash('Bio saved')
    } else {
      flash('Failed to save bio')
    }
    setSaving(false)
  }

  async function saveItem(item) {
    setSaving(true)
    const res = await api(`/api/merch/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    })
    if (res.ok) {
      const updated = await res.json()
      setMerch(merch.map((m) => (m.id === updated.id ? updated : m)))
      flash('Item saved')
    } else {
      flash('Failed to save item')
    }
    setSaving(false)
  }

  async function deleteItem(id) {
    if (!window.confirm('Delete this item?')) return
    const res = await api(`/api/merch/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMerch(merch.filter((m) => m.id !== id))
      flash('Item deleted')
    }
  }

  async function addItem() {
    const res = await api('/api/merch', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Item', description: '', price: '$0', category: 'T-Shirts', image: '' }),
    })
    if (res.ok) {
      const item = await res.json()
      setMerch([...merch, item])
      flash('Item added')
    }
  }

  async function uploadImage(itemId, file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api('/api/merch/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const { url } = await res.json()
      const item = merch.find((m) => m.id === itemId)
      if (item) saveItem({ ...item, image: url })
    }
  }

  async function saveRelease(release) {
    setSaving(true)
    const res = await api(`/api/releases/${release.id}`, {
      method: 'PUT',
      body: JSON.stringify(release),
    })
    if (res.ok) {
      const updated = await res.json()
      setReleases(releases.map((r) => (r.id === updated.id ? updated : r)))
      flash('Release saved')
    } else {
      flash('Failed to save release')
    }
    setSaving(false)
  }

  async function deleteRelease(id) {
    if (!window.confirm('Delete this release?')) return
    const res = await api(`/api/releases/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setReleases(releases.filter((r) => r.id !== id))
      flash('Release deleted')
    }
  }

  async function addRelease() {
    const res = await api('/api/releases', {
      method: 'POST',
      body: JSON.stringify({ title: 'New Release', artwork: '', releaseDate: '', tracks: [] }),
    })
    if (res.ok) {
      const release = await res.json()
      setReleases([...releases, release])
      flash('Release added')
    }
  }

  async function uploadReleaseArtwork(releaseId, file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api('/api/merch/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const { url } = await res.json()
      const release = releases.find((r) => r.id === releaseId)
      if (release) saveRelease({ ...release, artwork: url })
    }
  }

  function updateReleaseTracks(releaseId, tracksText) {
    setReleases(releases.map((r) =>
      r.id === releaseId ? { ...r, tracksText } : r
    ))
  }

  async function saveMember(member) {
    setSaving(true)
    const res = await api(`/api/members/${member.id}`, { method: 'PUT', body: JSON.stringify(member) })
    if (res.ok) {
      const updated = await res.json()
      setMembers(members.map((m) => (m.id === updated.id ? updated : m)))
      flash('Member saved')
    } else {
      flash('Failed to save member')
    }
    setSaving(false)
  }

  async function deleteMemberItem(id) {
    if (!window.confirm('Delete this member?')) return
    const res = await api(`/api/members/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMembers(members.filter((m) => m.id !== id))
      flash('Member deleted')
    }
  }

  async function addMemberItem() {
    const res = await api('/api/members', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Member', role: '', bio: '' }),
    })
    if (res.ok) {
      const member = await res.json()
      setMembers([...members, member])
      flash('Member added')
    }
  }

  async function saveShow(show) {
    setSaving(true)
    const res = await api(`/api/shows/${show.id}`, { method: 'PUT', body: JSON.stringify(show) })
    if (res.ok) {
      const updated = await res.json()
      setShows(shows.map((s) => (s.id === updated.id ? updated : s)))
      flash('Show saved')
    } else {
      flash('Failed to save show')
    }
    setSaving(false)
  }

  async function deleteShowItem(id) {
    if (!window.confirm('Delete this show?')) return
    const res = await api(`/api/shows/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setShows(shows.filter((s) => s.id !== id))
      flash('Show deleted')
    }
  }

  async function addShowItem() {
    const res = await api('/api/shows', {
      method: 'POST',
      body: JSON.stringify({ date: '', venue: '', city: '', ticketLink: '' }),
    })
    if (res.ok) {
      const show = await res.json()
      setShows([...shows, show])
      flash('Show added')
    }
  }

  function logout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (!bio || !merch || !releases || !members || !shows) return <div className="contact-page"><p>Loading...</p></div>

  const TABS = [
    { id: 'bio', label: 'Bio' },
    { id: 'releases', label: 'Releases' },
    { id: 'merch', label: 'Merch' },
    { id: 'members', label: 'Members' },
    { id: 'shows', label: 'Shows' },
  ]

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin</h1>
        <button onClick={logout} className="admin-btn admin-btn-secondary">Log Out</button>
      </div>

      {message && <div className="admin-flash">{message}</div>}

      <div className="admin-layout">
        <aside className="admin-sidebar">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-sidebar-link${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <div className="admin-main">
          {tab === 'bio' && (
            <section className="admin-section">
              <h2>Bio</h2>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={bio.title}
                  onChange={(e) => setBio({ ...bio, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Content <span className="admin-hint">Separate paragraphs with a blank line</span></label>
                <textarea
                  rows={16}
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                />
              </div>
              <div className="admin-actions">
                <button onClick={saveBio} className="admin-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Bio'}
                </button>
              </div>
            </section>
          )}

          {tab === 'merch' && (
            <section className="admin-section">
              <h2>Merch</h2>
              {merch.map((item) => (
                <div key={item.id} className="admin-merch-item">
                  <div className="admin-merch-fields">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, name: e.target.value } : m))}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price</label>
                        <input
                          type="text"
                          value={item.price}
                          onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, price: e.target.value } : m))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select
                          value={item.category}
                          onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, category: e.target.value } : m))}
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, description: e.target.value } : m))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Image</label>
                      <div className="admin-image-row">
                        {item.image && <img src={item.image} alt="" className="admin-thumb" />}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files[0] && uploadImage(item.id, e.target.files[0])}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-merch-actions">
                    <button onClick={() => saveItem(item)} className="admin-btn" disabled={saving}>Save</button>
                    <button onClick={() => deleteItem(item.id)} className="admin-btn admin-btn-danger">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={addItem} className="admin-btn admin-btn-secondary">Add Merch Item</button>
            </section>
          )}

          {tab === 'releases' && (
            <section className="admin-section">
              <h2>Releases</h2>
              {releases.map((release) => (
                <div key={release.id} className="admin-merch-item">
                  <div className="admin-merch-fields">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={release.title}
                        onChange={(e) => setReleases(releases.map((r) => r.id === release.id ? { ...r, title: e.target.value } : r))}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Release Date</label>
                        <input
                          type="text"
                          placeholder="e.g. March 2026"
                          value={release.releaseDate}
                          onChange={(e) => setReleases(releases.map((r) => r.id === release.id ? { ...r, releaseDate: e.target.value } : r))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Artwork</label>
                        <div className="admin-image-row">
                          {release.artwork && <img src={release.artwork} alt="" className="admin-thumb" />}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files[0] && uploadReleaseArtwork(release.id, e.target.files[0])}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Track Listing <span className="admin-hint">One track per line</span></label>
                      <textarea
                        rows={6}
                        value={release.tracksText !== undefined ? release.tracksText : (release.tracks || []).join('\n')}
                        onChange={(e) => updateReleaseTracks(release.id, e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="admin-merch-actions">
                    <button
                      onClick={() => {
                        const tracks = (release.tracksText !== undefined ? release.tracksText : (release.tracks || []).join('\n'))
                          .split('\n').map((t) => t.trim()).filter(Boolean)
                        saveRelease({ ...release, tracks, tracksText: undefined })
                      }}
                      className="admin-btn"
                      disabled={saving}
                    >
                      Save
                    </button>
                    <button onClick={() => deleteRelease(release.id)} className="admin-btn admin-btn-danger">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={addRelease} className="admin-btn admin-btn-secondary">Add Release</button>
            </section>
          )}

          {tab === 'members' && (
            <section className="admin-section">
              <h2>Band Members</h2>
              {members.map((member) => (
                <div key={member.id} className="admin-merch-item">
                  <div className="admin-merch-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => setMembers(members.map((m) => m.id === member.id ? { ...m, name: e.target.value } : m))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <input
                          type="text"
                          placeholder="e.g. Guitar, Vocals"
                          value={member.role}
                          onChange={(e) => setMembers(members.map((m) => m.id === member.id ? { ...m, role: e.target.value } : m))}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        rows={2}
                        value={member.bio}
                        onChange={(e) => setMembers(members.map((m) => m.id === member.id ? { ...m, bio: e.target.value } : m))}
                      />
                    </div>
                  </div>
                  <div className="admin-merch-actions">
                    <button onClick={() => saveMember(member)} className="admin-btn" disabled={saving}>Save</button>
                    <button onClick={() => deleteMemberItem(member.id)} className="admin-btn admin-btn-danger">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={addMemberItem} className="admin-btn admin-btn-secondary">Add Member</button>
            </section>
          )}

          {tab === 'shows' && (
            <section className="admin-section">
              <h2>Shows</h2>
              {shows.map((show) => (
                <div key={show.id} className="admin-merch-item">
                  <div className="admin-merch-fields">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Date</label>
                        <input
                          type="text"
                          placeholder="e.g. Apr 12, 2026"
                          value={show.date}
                          onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, date: e.target.value } : s))}
                        />
                      </div>
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          placeholder="e.g. Raleigh, NC"
                          value={show.city}
                          onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, city: e.target.value } : s))}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Venue</label>
                        <input
                          type="text"
                          value={show.venue}
                          onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, venue: e.target.value } : s))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Ticket Link <span className="admin-hint">Optional</span></label>
                        <input
                          type="text"
                          placeholder="https://..."
                          value={show.ticketLink}
                          onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, ticketLink: e.target.value } : s))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="admin-merch-actions">
                    <button onClick={() => saveShow(show)} className="admin-btn" disabled={saving}>Save</button>
                    <button onClick={() => deleteShowItem(show.id)} className="admin-btn admin-btn-danger">Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={addShowItem} className="admin-btn admin-btn-secondary">Add Show</button>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
