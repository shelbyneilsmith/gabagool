import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Bio from './pages/Bio'
import Merch from './pages/Merch'
import Live from './pages/Live'
import Contact from './pages/Contact'
import AdminLogin from './pages/AdminLogin'
import Admin from './pages/Admin'

function App() {
  return (
    <Router>
      <div className="relative z-1 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-[1100px] mx-auto p-8 w-full max-sm:p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bio" element={<Bio />} />
            <Route path="/live" element={<Live />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="text-center p-8 border-t border-border text-text-dim text-xs">
          <p>&copy; {new Date().getFullYear()} Gabagool. All rights reserved. None of this matters anyway.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
