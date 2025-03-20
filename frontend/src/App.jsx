import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { useState, useRef } from 'react'
import { TbAlignJustified } from "react-icons/tb";
import { useIsMobile } from './hooks/useWindowSize.jsx';
import { DEFAULT_MOBILE_WIDTH as mobileSize } from './config/constants.js';
import DropdownHeader from './components/app/DropdownHeader.jsx';
import Home from './pages/Home.jsx'
import Footer from './components/app/Footer.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegisterPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UserPage from './pages/UserPage.jsx';
import ProtectedLayout from './components/common/ProtectedLayout.jsx';

function App() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile({ mobileSize });
  const accessSectionRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldSowAccessButton, setShouldShowAccessButton] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToAccessSection = () => {
    accessSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      setIsScrolling(true);
    }, 600);

    setTimeout(() => {
      setIsScrolling(false);
    }, 1300);
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
                  to="/admin"
                  className='app-link header-app-nav-link'>
                  ADMIN
                </Link>
                <Link
                  to="/trainer"
                  className='app-link header-app-nav-link'>
                  ENTRENADOR
                </Link>
                <Link
                  to="/user"
                  className='app-link header-app-nav-link'>
                  USUARIO
                </Link>
              </nav>
            )}
          </section>

          <section className='header-app-right'>
            {shouldSowAccessButton && (
              <Link
                to="/login"
                className='app-link login-link'>
                ACCEDER
              </Link>
            )}

            {isMobile && (
              <>
                <TbAlignJustified
                  className='app-link header-app-right-options'
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                  }}
                />
                {isMenuOpen && (<DropdownHeader />)}
              </>
            )}
          </section>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isMobile={isMobile}
                accessSectionRef={accessSectionRef}
                scrollToAccessSection={scrollToAccessSection}
                isScrolling={isScrolling}
                setShouldShowAccessButton={setShouldShowAccessButton} />} />
          <Route path="/login" element={<LoginPage setShouldShowAccessButton={setShouldShowAccessButton} />} />
          <Route path="/register" element={<RegistrationPage setShouldShowAccessButton={setShouldShowAccessButton} />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route element={<ProtectedLayout allowedRoles={['user']} />}>
            <Route path="/usuario" element={<UserPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />

        </Routes >
        <Footer />
      </main>
    </BrowserRouter>
  )
}

export default App
