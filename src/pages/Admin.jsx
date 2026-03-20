import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const inputClass = 'w-full py-3 px-4 bg-bg-card border border-border-light rounded text-text font-body text-[0.95rem] transition-colors duration-200 focus:outline-none focus:border-accent'
const labelClass = 'block font-heading text-xs font-bold uppercase tracking-[0.1em] text-accent mb-2'
const btnClass = 'font-heading text-xs font-bold tracking-[0.1em] uppercase py-2.5 px-5 border-none rounded-sm bg-accent text-bg cursor-pointer transition-opacity duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed'
const btnSecondary = 'font-heading text-xs font-bold tracking-[0.1em] uppercase py-2.5 px-5 rounded-sm bg-transparent border border-text-dim text-text-dim cursor-pointer transition-colors duration-200 hover:border-accent hover:text-accent'
const btnDanger = 'font-heading text-xs font-bold tracking-[0.1em] uppercase py-2.5 px-5 border-none rounded-sm bg-danger text-white cursor-pointer transition-opacity duration-200 hover:opacity-85'
const sectionH2 = 'font-heading text-2xl font-bold uppercase tracking-[0.15em] text-accent mb-6 pb-3 border-b-2 border-border'
const cardClass = 'bg-bg-card border border-border rounded-md p-6 mb-4'

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
  const [liveIntro, setLiveIntro] = useState(null)
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
      api('/api/live-intro').then((r) => (r.ok ? r.json() : Promise.reject())),
      api('/api/members').then((r) => (r.ok ? r.json() : Promise.reject())),
      api('/api/shows').then((r) => (r.ok ? r.json() : Promise.reject())),
    ])
      .then(([bioData, merchData, releasesData, liveIntroData, membersData, showsData]) => {
        setBio(bioData)
        setBioText(bioData.paragraphs.join('\n\n'))
        setMerch(merchData)
        setReleases(releasesData)
        setLiveIntro(liveIntroData)
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
    if (res.ok) { setBio(updated); flash('Bio saved') } else { flash('Failed to save bio') }
    setSaving(false)
  }

  async function saveItem(item) {
    setSaving(true)
    const res = await api(`/api/merch/${item.id}`, { method: 'PUT', body: JSON.stringify(item) })
    if (res.ok) { const updated = await res.json(); setMerch(merch.map((m) => (m.id === updated.id ? updated : m))); flash('Item saved') } else { flash('Failed to save item') }
    setSaving(false)
  }

  async function deleteItem(id) {
    if (!window.confirm('Delete this item?')) return
    const res = await api(`/api/merch/${id}`, { method: 'DELETE' })
    if (res.ok) { setMerch(merch.filter((m) => m.id !== id)); flash('Item deleted') }
  }

  async function addItem() {
    const res = await api('/api/merch', { method: 'POST', body: JSON.stringify({ name: 'New Item', description: '', price: '$0', category: 'T-Shirts', image: '' }) })
    if (res.ok) { const item = await res.json(); setMerch([...merch, item]); flash('Item added') }
  }

  async function uploadImage(itemId, file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api('/api/merch/upload', { method: 'POST', body: formData })
    if (res.ok) { const { url } = await res.json(); const item = merch.find((m) => m.id === itemId); if (item) saveItem({ ...item, image: url }) }
  }

  async function saveRelease(release) {
    setSaving(true)
    const res = await api(`/api/releases/${release.id}`, { method: 'PUT', body: JSON.stringify(release) })
    if (res.ok) { const updated = await res.json(); setReleases(releases.map((r) => (r.id === updated.id ? updated : r))); flash('Release saved') } else { flash('Failed to save release') }
    setSaving(false)
  }

  async function deleteRelease(id) {
    if (!window.confirm('Delete this release?')) return
    const res = await api(`/api/releases/${id}`, { method: 'DELETE' })
    if (res.ok) { setReleases(releases.filter((r) => r.id !== id)); flash('Release deleted') }
  }

  async function addRelease() {
    const res = await api('/api/releases', { method: 'POST', body: JSON.stringify({ title: 'New Release', artwork: '', releaseDate: '', tracks: [] }) })
    if (res.ok) { const release = await res.json(); setReleases([...releases, release]); flash('Release added') }
  }

  async function uploadReleaseArtwork(releaseId, file) {
    const formData = new FormData()
    formData.append('image', file)
    const res = await api('/api/releases/upload', { method: 'POST', body: formData })
    if (res.ok) { const { url } = await res.json(); const release = releases.find((r) => r.id === releaseId); if (release) saveRelease({ ...release, artwork: url }) }
  }

  function updateReleaseTracks(releaseId, tracksText) {
    setReleases(releases.map((r) => r.id === releaseId ? { ...r, tracksText } : r))
  }

  async function saveLiveIntro() {
    setSaving(true)
    const res = await api('/api/live-intro', { method: 'PUT', body: JSON.stringify({ text: liveIntro }) })
    if (res.ok) { flash('Live intro saved') } else { flash('Failed to save live intro') }
    setSaving(false)
  }

  async function saveMember(member) {
    setSaving(true)
    const res = await api(`/api/members/${member.id}`, { method: 'PUT', body: JSON.stringify(member) })
    if (res.ok) { const updated = await res.json(); setMembers(members.map((m) => (m.id === updated.id ? updated : m))); flash('Member saved') } else { flash('Failed to save member') }
    setSaving(false)
  }

  async function deleteMemberItem(id) {
    if (!window.confirm('Delete this member?')) return
    const res = await api(`/api/members/${id}`, { method: 'DELETE' })
    if (res.ok) { setMembers(members.filter((m) => m.id !== id)); flash('Member deleted') }
  }

  async function addMemberItem() {
    const res = await api('/api/members', { method: 'POST', body: JSON.stringify({ name: 'New Member', role: '', bio: '' }) })
    if (res.ok) { const member = await res.json(); setMembers([...members, member]); flash('Member added') }
  }

  async function saveShow(show) {
    setSaving(true)
    const res = await api(`/api/shows/${show.id}`, { method: 'PUT', body: JSON.stringify(show) })
    if (res.ok) { const updated = await res.json(); setShows(shows.map((s) => (s.id === updated.id ? updated : s))); flash('Show saved') } else { flash('Failed to save show') }
    setSaving(false)
  }

  async function deleteShowItem(id) {
    if (!window.confirm('Delete this show?')) return
    const res = await api(`/api/shows/${id}`, { method: 'DELETE' })
    if (res.ok) { setShows(shows.filter((s) => s.id !== id)); flash('Show deleted') }
  }

  async function addShowItem() {
    const res = await api('/api/shows', { method: 'POST', body: JSON.stringify({ date: '', venue: '', city: '', ticketLink: '' }) })
    if (res.ok) { const show = await res.json(); setShows([...shows, show]); flash('Show added') }
  }

  function logout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (!bio || !merch || !releases || liveIntro === null || !members || !shows) return <div className="max-w-[750px] mx-auto py-12"><p>Loading...</p></div>

  const TABS = [
    { id: 'bio', label: 'Bio' },
    { id: 'releases', label: 'Releases' },
    { id: 'merch', label: 'Merch' },
    { id: 'live', label: 'Live' },
  ]

  return (
    <div className="max-w-[1000px] mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright">Admin</h1>
        <button onClick={logout} className={btnSecondary}>Log Out</button>
      </div>

      {message && <div className="bg-accent text-bg py-3 px-4 rounded mb-6 font-semibold text-sm">{message}</div>}

      <div className="flex gap-8 max-sm:flex-col max-sm:gap-4">
        <aside className="w-40 shrink-0 flex flex-col gap-1 sticky top-20 self-start max-sm:w-full max-sm:flex-row max-sm:flex-wrap max-sm:static max-sm:border-b max-sm:border-border max-sm:pb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`block text-left font-heading text-sm font-medium tracking-[0.05em] py-2.5 px-4 rounded cursor-pointer transition-all duration-200 border-none max-sm:text-xs max-sm:py-2 max-sm:px-3 ${tab === t.id ? 'text-accent-bright bg-accent/10 font-bold' : 'text-text-dim bg-transparent hover:text-accent-bright hover:bg-white/[0.03]'}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          {tab === 'bio' && (
            <section className="mb-12">
              <h2 className={sectionH2}>Bio</h2>
              <div className="mb-6">
                <label className={labelClass}>Title</label>
                <input type="text" value={bio.title} onChange={(e) => setBio({ ...bio, title: e.target.value })} className={inputClass} />
              </div>
              <div className="mb-6">
                <label className={labelClass}>Content <span className="font-normal text-[0.7rem] text-text-dim normal-case tracking-normal ml-2">Separate paragraphs with a blank line</span></label>
                <textarea rows={16} value={bioText} onChange={(e) => setBioText(e.target.value)} className={`${inputClass} resize-y`} />
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={saveBio} className={btnClass} disabled={saving}>{saving ? 'Saving...' : 'Save Bio'}</button>
              </div>
            </section>
          )}

          {tab === 'merch' && (
            <section className="mb-12">
              <h2 className={sectionH2}>Merch</h2>
              {merch.map((item) => (
                <div key={item.id} className={cardClass}>
                  <div className="mb-6">
                    <label className={labelClass}>Name</label>
                    <input type="text" value={item.name} onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, name: e.target.value } : m))} className={inputClass} />
                  </div>
                  <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">
                    <div className="mb-6 flex-1">
                      <label className={labelClass}>Price</label>
                      <input type="text" value={item.price} onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, price: e.target.value } : m))} className={inputClass} />
                    </div>
                    <div className="mb-6 flex-1">
                      <label className={labelClass}>Category</label>
                      <select value={item.category} onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, category: e.target.value } : m))} className={inputClass}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Description</label>
                    <textarea rows={2} value={item.description} onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, description: e.target.value } : m))} className={`${inputClass} resize-y`} />
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Image</label>
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} alt="" className="w-[60px] h-[60px] object-cover rounded" />}
                      <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadImage(item.id, e.target.files[0])} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => saveItem(item)} className={btnClass} disabled={saving}>Save</button>
                    <button onClick={() => deleteItem(item.id)} className={btnDanger}>Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={addItem} className={btnSecondary}>Add Merch Item</button>
            </section>
          )}

          {tab === 'releases' && (
            <section className="mb-12">
              <h2 className={sectionH2}>Releases</h2>
              {releases.map((release) => (
                <div key={release.id} className={cardClass}>
                  <div className="mb-6">
                    <label className={labelClass}>Title</label>
                    <input type="text" value={release.title} onChange={(e) => setReleases(releases.map((r) => r.id === release.id ? { ...r, title: e.target.value } : r))} className={inputClass} />
                  </div>
                  <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">
                    <div className="mb-6 flex-1">
                      <label className={labelClass}>Release Date</label>
                      <input type="text" placeholder="e.g. March 2026" value={release.releaseDate} onChange={(e) => setReleases(releases.map((r) => r.id === release.id ? { ...r, releaseDate: e.target.value } : r))} className={inputClass} />
                    </div>
                    <div className="mb-6 flex-1">
                      <label className={labelClass}>Artwork</label>
                      <div className="flex items-center gap-4">
                        {release.artwork && <img src={release.artwork} alt="" className="w-[60px] h-[60px] object-cover rounded" />}
                        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && uploadReleaseArtwork(release.id, e.target.files[0])} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Track Listing <span className="font-normal text-[0.7rem] text-text-dim normal-case tracking-normal ml-2">One track per line</span></label>
                    <textarea rows={6} value={release.tracksText !== undefined ? release.tracksText : (release.tracks || []).join('\n')} onChange={(e) => updateReleaseTracks(release.id, e.target.value)} className={`${inputClass} resize-y`} />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => { const tracks = (release.tracksText !== undefined ? release.tracksText : (release.tracks || []).join('\n')).split('\n').map((t) => t.trim()).filter(Boolean); saveRelease({ ...release, tracks, tracksText: undefined }) }} className={btnClass} disabled={saving}>Save</button>
                    <button onClick={() => deleteRelease(release.id)} className={btnDanger}>Delete</button>
                  </div>
                </div>
              ))}
              <button onClick={addRelease} className={btnSecondary}>Add Release</button>
            </section>
          )}

          {tab === 'live' && (
            <>
              <section className="mb-12">
                <h2 className={sectionH2}>Intro</h2>
                <div className="mb-6">
                  <label className={labelClass}>Intro Paragraph</label>
                  <textarea rows={4} value={liveIntro} onChange={(e) => setLiveIntro(e.target.value)} className={`${inputClass} resize-y`} />
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={saveLiveIntro} className={btnClass} disabled={saving}>{saving ? 'Saving...' : 'Save Intro'}</button>
                </div>
              </section>

              <section className="mb-12">
                <h2 className={sectionH2}>Band Members</h2>
                {members.map((member) => (
                  <div key={member.id} className={cardClass}>
                    <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">
                      <div className="mb-6 flex-1">
                        <label className={labelClass}>Name</label>
                        <input type="text" value={member.name} onChange={(e) => setMembers(members.map((m) => m.id === member.id ? { ...m, name: e.target.value } : m))} className={inputClass} />
                      </div>
                      <div className="mb-6 flex-1">
                        <label className={labelClass}>Role</label>
                        <input type="text" placeholder="e.g. Guitar, Vocals" value={member.role} onChange={(e) => setMembers(members.map((m) => m.id === member.id ? { ...m, role: e.target.value } : m))} className={inputClass} />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className={labelClass}>Bio</label>
                      <textarea rows={2} value={member.bio} onChange={(e) => setMembers(members.map((m) => m.id === member.id ? { ...m, bio: e.target.value } : m))} className={`${inputClass} resize-y`} />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => saveMember(member)} className={btnClass} disabled={saving}>Save</button>
                      <button onClick={() => deleteMemberItem(member.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
                <button onClick={addMemberItem} className={btnSecondary}>Add Member</button>
              </section>

              <section className="mb-12">
                <h2 className={sectionH2}>Shows</h2>
                {shows.map((show) => (
                  <div key={show.id} className={cardClass}>
                    <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">
                      <div className="mb-6 flex-1">
                        <label className={labelClass}>Date</label>
                        <input type="text" placeholder="e.g. Apr 12, 2026" value={show.date} onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, date: e.target.value } : s))} className={inputClass} />
                      </div>
                      <div className="mb-6 flex-1">
                        <label className={labelClass}>City</label>
                        <input type="text" placeholder="e.g. Raleigh, NC" value={show.city} onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, city: e.target.value } : s))} className={inputClass} />
                      </div>
                    </div>
                    <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">
                      <div className="mb-6 flex-1">
                        <label className={labelClass}>Venue</label>
                        <input type="text" value={show.venue} onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, venue: e.target.value } : s))} className={inputClass} />
                      </div>
                      <div className="mb-6 flex-1">
                        <label className={labelClass}>Ticket Link <span className="font-normal text-[0.7rem] text-text-dim normal-case tracking-normal ml-2">Optional</span></label>
                        <input type="text" placeholder="https://..." value={show.ticketLink} onChange={(e) => setShows(shows.map((s) => s.id === show.id ? { ...s, ticketLink: e.target.value } : s))} className={inputClass} />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => saveShow(show)} className={btnClass} disabled={saving}>Save</button>
                      <button onClick={() => deleteShowItem(show.id)} className={btnDanger}>Delete</button>
                    </div>
                  </div>
                ))}
                <button onClick={addShowItem} className={btnSecondary}>Add Show</button>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
