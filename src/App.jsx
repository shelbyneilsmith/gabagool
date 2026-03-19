import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Bio from './pages/Bio'
import Merch from './pages/Merch'
import Contact from './pages/Contact'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bio" element={<Bio />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Gabagool. All rights reserved. None of this matters anyway.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
