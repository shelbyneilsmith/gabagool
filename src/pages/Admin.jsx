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
  const [merch, setMerch] = useState(null)
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
    ])
      .then(([bioData, merchData]) => {
        setBio(bioData)
        setMerch(merchData)
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
    const res = await api('/api/bio', { method: 'PUT', body: JSON.stringify(bio) })
    if (res.ok) flash('Bio saved')
    else flash('Failed to save bio')
    setSaving(false)
  }

  function updateParagraph(index, value) {
    const updated = [...bio.paragraphs]
    updated[index] = value
    setBio({ ...bio, paragraphs: updated })
  }

  function addParagraph() {
    setBio({ ...bio, paragraphs: [...bio.paragraphs, ''] })
  }

  function removeParagraph(index) {
    const updated = bio.paragraphs.filter((_, i) => i !== index)
    setBio({ ...bio, paragraphs: updated })
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

  function logout() {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  if (!bio || !merch) return <div className="contact-page"><p>Loading...</p></div>

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin</h1>
        <button onClick={logout} className="admin-btn admin-btn-secondary">Log Out</button>
      </div>

      {message && <div className="admin-flash">{message}</div>}

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
        {bio.paragraphs.map((p, i) => (
          <div key={i} className="admin-paragraph">
            <div className="form-group">
              <label>
                Paragraph {i + 1}
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="admin-remove-btn"
                >
                  Remove
                </button>
              </label>
              <textarea rows={4} value={p} onChange={(e) => updateParagraph(i, e.target.value)} />
            </div>
          </div>
        ))}
        <div className="admin-actions">
          <button onClick={addParagraph} className="admin-btn admin-btn-secondary">Add Paragraph</button>
          <button onClick={saveBio} className="admin-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save Bio'}
          </button>
        </div>
      </section>

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
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => setMerch(merch.map((m) => m.id === item.id ? { ...m, category: e.target.value } : m))}
                  />
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
    </div>
  )
}

export default Admin
