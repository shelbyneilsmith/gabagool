function Home() {
  return (
    <div>
      <section className="text-center pt-16 pb-12 max-sm:pt-4 max-sm:pb-2">
        <img src="/gabagool_logo.png" alt="Gabagool" className="w-[600px] max-w-full h-auto mx-auto max-sm:w-[400px]" />
      </section>

      <section className="pt-4 pb-16">
        <div className="flex gap-12 items-center max-sm:flex-col max-sm:gap-8">
          <div className="shrink-0 w-[420px] max-sm:w-full max-sm:max-w-[360px] max-sm:mx-auto">
            <img src="/hw_cover.jpg" alt="Horror, Wonder album cover" className="w-full h-auto rounded-md shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_80px_rgba(212,197,169,0.06)]" />
          </div>
          <div className="flex flex-col gap-4 max-sm:items-center max-sm:text-center">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-text-dim">New Album</p>
            <h2 className="font-heading text-5xl font-bold text-accent-bright tracking-tight leading-[1.1] max-sm:text-[2.2rem]">Horror, Wonder</h2>
            <p className="text-[1.05rem] leading-[1.8] text-text max-w-[440px] max-sm:max-w-full">
              The long-awaited full-length. Twelve tracks of dread, wonder, and whatever
              happens when you stop pretending everything is fine. Out now everywhere.
            </p>
            <div className="flex flex-col gap-3 mt-2 max-sm:items-center">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 py-[0.85rem] px-6 rounded-full font-heading text-sm font-semibold tracking-[0.02em] no-underline transition-all duration-200 w-fit hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] bg-spotify text-black"
              >
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] shrink-0 fill-black" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                Listen on Spotify
              </a>
              <a
                href="https://music.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 py-[0.85rem] px-6 rounded-full font-heading text-sm font-semibold tracking-[0.02em] no-underline transition-all duration-200 w-fit hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] bg-apple-music text-white"
              >
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] shrink-0 fill-white" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Listen on Apple Music
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
