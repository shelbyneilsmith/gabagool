import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const inputClass = 'w-full py-3 px-4 bg-bg-card border border-border-light rounded text-text font-body text-[0.95rem] transition-colors duration-200 focus:outline-none focus:border-accent'
const labelClass = 'block font-heading text-xs font-bold uppercase tracking-[0.1em] text-accent mb-2'

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
    <div className="max-w-[750px] mx-auto py-12">
      <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright mb-2">Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="password" className={labelClass}>Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
        </div>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <button type="submit" className="font-heading text-sm font-bold tracking-[0.1em] uppercase py-[0.85rem] px-8 border-none rounded-sm bg-accent text-bg cursor-pointer transition-opacity duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
