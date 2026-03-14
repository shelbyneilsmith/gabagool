const tourDates = [
  { date: 'APR 12', venue: 'The Void', city: 'Brooklyn, NY', status: 'sold out' },
  { date: 'APR 18', venue: 'Regret Factory', city: 'Philadelphia, PA', status: 'available' },
  { date: 'APR 25', venue: 'The Bitter End', city: 'Boston, MA', status: 'available' },
  { date: 'MAY 03', venue: 'Abandon All Hope Lounge', city: 'Baltimore, MD', status: 'available' },
  { date: 'MAY 10', venue: 'Club Existential', city: 'Washington, DC', status: 'low tickets' },
  { date: 'MAY 17', venue: 'The Last Laugh', city: 'Richmond, VA', status: 'available' },
  { date: 'JUN 01', venue: 'Doomfest 2026', city: 'Austin, TX', status: 'available' },
  { date: 'JUN 14', venue: 'The Meat Locker', city: 'Chicago, IL', status: 'available' },
]

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <img src="/gabagool_logo.png" alt="Gabagool" className="hero-logo" />
        <h1>The Tour Nobody Asked For</h1>
        <p className="tagline">Yet here we are. Again.</p>
      </section>

      <section className="tour-dates">
        <h2>Tour Dates</h2>
        <div className="dates-list">
          {tourDates.map((show, i) => (
            <div key={i} className="tour-row">
              <span className="tour-date">{show.date}</span>
              <div className="tour-info">
                <span className="tour-venue">{show.venue}</span>
                <span className="tour-city">{show.city}</span>
              </div>
              <span className={`tour-status ${show.status.replace(' ', '-')}`}>
                {show.status === 'sold out' ? 'SOLD OUT' :
                 show.status === 'low tickets' ? 'LOW TICKETS' :
                 'TICKETS'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
