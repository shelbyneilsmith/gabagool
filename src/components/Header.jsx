import { NavLink, useLocation } from 'react-router-dom'

function Header() {
  const isHome = useLocation().pathname === '/'

  return (
    <header className="header">
      <div className="header-content">
        {!isHome && (
          <a href="/" className="logo-link">
            <img src="/gabagool_logo.png" alt="Gabagool" className="logo" />
          </a>
        )}
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/bio">Bio</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
