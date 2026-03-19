import { useState } from 'react'

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
      <div className="contact-page">
        <div className="contact-success">
          <h1>Message Sent</h1>
          <p>Thanks for reaching out. We'll get back to you eventually. Probably.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="contact-page">
      <h1>Contact</h1>
      <p className="contact-subtitle">
        Booking inquiries, merch questions, existential crises — we're here for all of it.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject...</option>
            <option value="merch">Merch Inquiry</option>
            <option value="booking">Booking</option>
            <option value="press">Press / Media</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="contact-error">{error}</p>}
        <button type="submit" className="contact-submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}

export default Contact
