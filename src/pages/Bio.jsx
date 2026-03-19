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
  const [releases, setReleases] = useState([])

  useEffect(() => {
    fetch('/api/bio')
      .then((r) => r.json())
      .then(setBio)
      .catch(() => setBio(FALLBACK))
    fetch('/api/releases')
      .then((r) => r.json())
      .then(setReleases)
      .catch(() => {})
  }, [])

  if (!bio) return <div><section className="max-w-[750px] mx-auto py-12"></section></div>

  return (
    <div>
      <section className="max-w-[750px] mx-auto py-12">
        <h1 className="font-heading text-[2.5rem] font-bold text-accent-bright mb-8">{bio.title}</h1>
        {bio.paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? 'text-[1.15rem] leading-[1.8] text-accent mb-6' : 'mb-5 text-text leading-[1.8]'}>
            {p}
          </p>
        ))}

        {releases.length > 0 && (
          <>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-[0.15em] text-accent mt-12 mb-6 pb-3 border-b-2 border-border">Releases</h2>
            <div className="flex flex-col gap-8">
              {releases.map((release) => (
                <div key={release.id} className="flex gap-6 bg-bg-card border border-border rounded-md p-6 max-sm:flex-col max-sm:items-center max-sm:text-center">
                  {release.artwork && (
                    <img src={release.artwork} alt={release.title} className="w-40 h-40 object-cover rounded shrink-0 max-sm:w-[200px] max-sm:h-[200px]" />
                  )}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-[1.3rem] font-bold text-accent-bright">{release.title}</h3>
                    {release.releaseDate && (
                      <span className="text-sm text-text-dim italic">{release.releaseDate}</span>
                    )}
                    {release.tracks && release.tracks.length > 0 && (
                      <ol className="list-decimal pl-5 mt-2 max-sm:text-left">
                        {release.tracks.map((track, i) => (
                          <li key={i} className="text-sm text-text leading-[1.8]">{track}</li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default Bio
