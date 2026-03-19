import { useState, useEffect } from 'react'

const sectionH2 = 'font-heading text-2xl font-bold uppercase tracking-[0.15em] text-accent mb-6 pb-3 border-b-2 border-border'

function Live() {
  const [members, setMembers] = useState(null)
  const [shows, setShows] = useState(null)
  const [liveIntro, setLiveIntro] = useState(null)

  useEffect(() => {
    fetch('/api/members').then((r) => r.json()).then(setMembers).catch(() => setMembers([]))
    fetch('/api/shows').then((r) => r.json()).then(setShows).catch(() => setShows([]))
    fetch('/api/live-intro').then((r) => r.json()).then(setLiveIntro).catch(() => setLiveIntro(''))
  }, [])

  if (!members || !shows || liveIntro === null) return <div className="max-w-[750px] mx-auto py-12"><p>Loading...</p></div>

  return (
    <div className="max-w-[750px] mx-auto py-12">
      <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright mb-4">Live</h1>
      {liveIntro && <p className="text-[1.05rem] leading-[1.8] text-text mb-10">{liveIntro}</p>}

      {members.length > 0 && (
        <section className="mb-12">
          <h2 className={sectionH2}>The Band</h2>
          <div className="flex flex-col">
            {members.map((member, i) => (
              <div key={member.id} className={`flex items-baseline gap-4 py-3 border-b border-border ${i === 0 ? 'border-t' : ''}`}>
                <span className="font-heading text-base font-bold text-accent-bright">{member.name}</span>
                {member.role && <span className="text-sm text-text-dim">{member.role}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className={sectionH2}>Upcoming Shows</h2>
        {shows.length > 0 ? (
          <div className="flex flex-col">
            {shows.map((show, i) => (
              <div key={show.id} className={`flex items-center gap-6 py-5 border-b border-border max-sm:flex-wrap max-sm:gap-2 ${i === 0 ? 'border-t' : ''}`}>
                <div className="font-heading text-sm font-bold text-accent whitespace-nowrap min-w-[120px] max-sm:min-w-0 max-sm:w-full">{show.date}</div>
                <div className="flex-1 flex flex-col gap-[0.15rem]">
                  <span className="font-semibold text-accent-bright">{show.venue}</span>
                  {show.city && <span className="text-sm text-text-dim">{show.city}</span>}
                </div>
                {show.ticketLink && (
                  <a href={show.ticketLink} target="_blank" rel="noopener noreferrer" className="font-heading text-xs font-bold tracking-[0.1em] uppercase no-underline py-2 px-5 rounded-sm bg-accent text-bg transition-opacity duration-200 whitespace-nowrap hover:opacity-85 max-sm:w-full max-sm:text-center max-sm:mt-1">
                    Tickets
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-dim text-[1.1rem] italic">No upcoming shows. Check back soon.</p>
        )}
      </section>
    </div>
  )
}

export default Live
