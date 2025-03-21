import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useState, useRef } from 'react'
import { useIsMobile } from './hooks/useWindowSize.jsx';
import { DEFAULT_MOBILE_WIDTH as mobileSize } from './config/constants.js';
import Home from './pages/Home.jsx'
import Footer from './components/app/Footer.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegisterPage.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UserPage from './pages/UserPage.jsx';
import ProtectedLayout from './components/common/ProtectedLayout.jsx';
import Header from './components/app/Header.jsx';
import { AccountProvider } from './context/AccountContext.jsx';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile({ mobileSize });
  const accessSectionRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [shouldShowAccessButton, setShouldShowAccessButton] = useState(false);

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
    <AccountProvider>
      <BrowserRouter>
        <main className='main-app' onClick={() => isMenuOpen && setIsMenuOpen(false)}>
          <Header
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            isMobile={isMobile}
            shouldShowAccessButton={shouldShowAccessButton}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Home
                  isMobile={isMobile}
                  accessSectionRef={accessSectionRef}
                  scrollToAccessSection={scrollToAccessSection}
                  isScrolling={isScrolling}
                  setShouldShowAccessButton={setShouldShowAccessButton} />}
            />
            <Route
              path="/login"
              element={<LoginPage setShouldShowAccessButton={setShouldShowAccessButton} />}
            />
            <Route
              path="/register"
              element={<RegistrationPage setShouldShowAccessButton={setShouldShowAccessButton} />}
            />

            {/* Rutas protegidas */}
            <Route element={<ProtectedLayout allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
            </Route>

            <Route element={<ProtectedLayout allowedRoles={['user']} />}>
              <Route path="/usuario" element={<UserPage />} />
              <Route path="/usuario/*" element={<UserPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </main>
      </BrowserRouter>
    </AccountProvider>
  )
}

export default App