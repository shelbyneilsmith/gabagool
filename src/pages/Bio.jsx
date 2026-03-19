import { useState, useEffect } from 'react'

const FALLBACK = {
  title: 'So What About Gabagool',
  paragraphs: [
    'Gabagool is the solo project of Shelby Neil Smith — a 45-year-old tattooer, web developer, and dad who retreats to his basement to make the kind of noise that his family tolerates and his neighbors pretend not to hear.',
    "When he's not inking skin, pushing pixels, or keeping small humans alive, Shelby writes and records everything himself in a basement studio held together by duct tape, cheap beer, and spite. The songs are heavy, the lyrics are bleak, and somehow the whole thing is still pretty funny if you squint hard enough.",
    'Gabagool started in 2019 as a way to process the slow, creeping realization that adulthood is mostly just pretending you know what you\'re doing while everything quietly falls apart around you. Turns out that\'s a pretty universal feeling, and people started showing up.',
    'The debut EP, "Everything Is Fine (It\'s Not)", was recorded between client sessions and school pickups. The follow-up LP, "Meat Sweats", was written almost entirely after midnight because that\'s the only time the house is quiet enough to hear yourself think — which, honestly, is part of the problem.',
    'One guy. One basement. Zero excuses.',
  ],
}

function Bio() {
  const [bio, setBio] = useState(null)

  useEffect(() => {
    fetch('/api/bio')
      .then((r) => r.json())
      .then(setBio)
      .catch(() => setBio(FALLBACK))
  }, [])

  const data = bio || FALLBACK

  return (
    <div className="bio">
      <section className="bio-content">
        <h1>{data.title}</h1>
        {data.paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? 'bio-lede' : undefined}>
            {p}
          </p>
        ))}
      </section>
    </div>
  )
}

export default Bio
