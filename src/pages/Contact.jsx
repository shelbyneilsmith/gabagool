import { useState } from 'react'

const inputClass = 'w-full py-3 px-4 bg-bg-card border border-border-light rounded text-text font-body text-[0.95rem] transition-colors duration-200 focus:outline-none focus:border-accent'
const labelClass = 'block font-heading text-xs font-bold uppercase tracking-[0.1em] text-accent mb-2'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('https://formspree.io/f/mgondpqa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Try again.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    }
    setSending(false)
  }

  if (submitted) {
    return (
      <div className="max-w-[750px] mx-auto py-12">
        <div className="text-center py-16">
          <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright mb-2">Message Sent</h1>
          <p className="text-text-dim text-[1.1rem] italic mt-4">Thanks for reaching out. We'll get back to you eventually. Probably.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[750px] mx-auto py-12">
      <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright mb-2">Contact</h1>
      <p className="text-text-dim text-[1.1rem] italic mb-10">
        Booking inquiries, merch questions, existential crises — we're here for all of it.
      </p>

      <form onSubmit={handleSubmit}>
        <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <div className="flex gap-6 max-sm:flex-col max-sm:gap-0">
          <div className="mb-6 flex-1">
            <label htmlFor="name" className={labelClass}>Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
          </div>
          <div className="mb-6 flex-1">
            <label htmlFor="email" className={labelClass}>Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="subject" className={labelClass}>Subject</label>
          <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass}>
            <option value="">Select a subject...</option>
            <option value="merch">Merch Inquiry</option>
            <option value="booking">Booking</option>
            <option value="press">Press / Media</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="message" className={labelClass}>Message</label>
          <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required className={`${inputClass} resize-y min-h-[120px]`} />
        </div>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <button type="submit" className="font-heading text-sm font-bold tracking-[0.1em] uppercase py-[0.85rem] px-8 border-none rounded-sm bg-accent text-bg cursor-pointer transition-opacity duration-200 hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}

export default Contact
