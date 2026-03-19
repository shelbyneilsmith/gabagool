import { useState, useEffect } from 'react'

function Live() {
  const [members, setMembers] = useState(null)
  const [shows, setShows] = useState(null)

  useEffect(() => {
    fetch('/api/members').then((r) => r.json()).then(setMembers).catch(() => setMembers([]))
    fetch('/api/shows').then((r) => r.json()).then(setShows).catch(() => setShows([]))
  }, [])

  if (!members || !shows) return <div className="live-page"><p>Loading...</p></div>

  return (
    <div className="live-page">
      {members.length > 0 && (
        <section className="live-section">
          <h1>The Band</h1>
          <div className="members-grid">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <h3>{member.name}</h3>
                {member.role && <span className="member-role">{member.role}</span>}
                {member.bio && <p>{member.bio}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="live-section">
        <h1>{members.length > 0 ? 'Upcoming Shows' : 'Live'}</h1>
        {shows.length > 0 ? (
          <div className="shows-list">
            {shows.map((show) => (
              <div key={show.id} className="show-row">
                <div className="show-date">{show.date}</div>
                <div className="show-details">
                  <span className="show-venue">{show.venue}</span>
                  {show.city && <span className="show-city">{show.city}</span>}
                </div>
                {show.ticketLink && (
                  <a href={show.ticketLink} target="_blank" rel="noopener noreferrer" className="show-tickets">
                    Tickets
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-shows">No upcoming shows. Check back soon.</p>
        )}
      </section>
    </div>
  )
}

export default Live
