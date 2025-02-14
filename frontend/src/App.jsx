import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { useState } from 'react'
import { TbAlignJustified } from "react-icons/tb";
import { useWindowSize } from './hooks/useWindowSize.jsx';
import { MOBILE_WIDTH } from './config/constants.js';
import DropdownHeader from './components/DropdownHeader.jsx';
import Home from './pages/Home.jsx'

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const windowWidth = useWindowSize();
  const isMobile = windowWidth < MOBILE_WIDTH;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <BrowserRouter>
      <main className='main-app' onClick={() => isMenuOpen && setIsMenuOpen(false)}>
        <header className='header-app'>
          <section className='header-app-left'>
            <Link to="/" className='app-link'>
              <img src="HammerStrength.png" alt="logo" className='header-app-logo' />
            </Link>
            {!isMobile && (
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
            )}
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
            {isMobile && (
              <>
                <TbAlignJustified
                  className='app-link header-app-right-options'
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                  }}
                />
                {isMenuOpen && ( <DropdownHeader/> )}
              </>
            )}
          </section>
        </header>
        <Routes>
          <Route path="/" element={<Home isMobile={isMobile}/>} />
        </Routes>
        </main>
    </BrowserRouter>
  )
}

export default App
