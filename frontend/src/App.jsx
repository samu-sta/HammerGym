import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { useState } from 'react'

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <BrowserRouter>
      <main className='main-app'>
        <header className='header-app'>
          <section className='header-app-left'>
            <Link to="/" className='app-link'>
              <img src="HammerStrength.png" alt="logo" className='header-app-logo' />
            </Link>
            <nav className='header-app-nav'>
              <Link
                to="/exercises"
                className='app-link header-app-nav-link'>
                EJERCICIOS
              </Link>
              <Link
                to="/routines"
                className='app-link header-app-nav-link'>
                RUTINAS
              </Link>
              <Link
                to="/trainers"
                className='app-link header-app-nav-link'>
                ENTRENADORES
              </Link>

            </nav>

          </section>

          <section className='header-app-right'>
            <Link
              to="/login"
              className='app-link login-link'>
              ACCEDER
            </Link>
            <Link
              to="/register"
              className='app-link register-link'>
              INSCRÍBETE
            </Link>
          </section>

        </header>
      </main>
    </BrowserRouter>
  )
}

export default App
