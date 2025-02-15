import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { useState, useRef } from 'react'
import { TbAlignJustified } from "react-icons/tb";
import { useWindowSize } from './hooks/useWindowSize.jsx';
import { MOBILE_WIDTH } from './config/constants.js';
import DropdownHeader from './components/DropdownHeader.jsx';
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx';

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const windowWidth = useWindowSize();
  const isMobile = windowWidth < MOBILE_WIDTH;
  const accessSectionRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAccessSection = () => {
    accessSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Reset scrolling state after the animation completes
    setTimeout(() => {
      setIsScrolling(true);
    }, 600); // Adjust the timeout to match the scroll animation duration

    setTimeout(() => {
      setIsScrolling(false);
    }, 1300); // Adjust the timeout to match the scroll animation duration
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
            <button
              to="/login"
              className='app-link login-link'
              onClick={scrollToAccessSection}>
              ACCEDER
            </button>
            
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
          <Route path="/" element={<Home isMobile={isMobile} accessSectionRef={accessSectionRef} scrollToAccessSection={scrollToAccessSection} isScrolling={isScrolling}/>} />
        </Routes>
        <Footer />
        </main>
    </BrowserRouter>
  )
}

export default App
