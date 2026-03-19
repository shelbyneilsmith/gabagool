import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        localStorage.setItem('admin_token', data.token)
        navigate('/admin')
      }
    } catch {
      setError('Connection failed')
    }
    setLoading(false)
  }

  return (
    <div className="contact-page">
      <h1>Admin Login</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="contact-error">{error}</p>}
        <button type="submit" className="contact-submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
