import React, {useEffect} from 'react';
import './styles/Home.css';
import { Link } from 'react-router-dom';
import AccessHome from '../components/home/AccessHome.jsx';
import SliderHome from '../components/home/SliderHome.jsx';
import AchievementHome from '../components/home/AchievementHome.jsx';
import { PERSONAL } from '../config/constants.js';
const Home = ({ isMobile, accessSectionRef, scrollToAccessSection, isScrolling, setShouldShowAccessButton }) => {
  
  useEffect(() => {
      setShouldShowAccessButton(true);
      window.scrollTo(0, 0);
    }, []);
  
  return (
    <main className='main-home'>
      <section className={isMobile ? 'main-home-content main-home-content-mobile'
        : 'main-home-content'}>
        <article className={isMobile ? 'main-home-article main-home-article-mobile'
          : 'main-home-article'}>
          <h2 className='main-home-title'>ENTRENA COMO UN ATLETA <br /> <b>CON LO MEJOR DEL FITNESS</b></h2>
          <section className='main-home-achievements'>
            <AchievementHome isMobile={isMobile}>Nº1 ESPAÑA</AchievementHome>
            <AchievementHome isMobile={isMobile}>ABIERTO 24/7</AchievementHome>
            <AchievementHome isMobile={isMobile}>365 DÍAS AL AÑO</AchievementHome>
            <AchievementHome isMobile={isMobile}>ACCESO NACIONAL</AchievementHome>
          </section>
          <button
            className='app-link primary-button register-link-home'
            aria-label="Inscríbete ahora"
            onClick={scrollToAccessSection}>
            INSCRÍBETE
          </button>

        </article>
      </section>
      <section className='main-home-slider'>
        <h2 className={isMobile ? 'main-home-slider-title main-home-slider-title-mobile'
          : 'main-home-slider-title'}>
          DESCUBRE NUESTRAS INSTALACIONES
        </h2>
        <SliderHome isMobile={isMobile} />
      </section>
      <section className='main-home-register-section' ref={accessSectionRef}>
        <h2 className={isMobile ? 'main-home-slider-title main-home-slider-title-mobile'
          : 'main-home-slider-title'}>
          ACCESO
        </h2>
        <main className={`main-home-register-section-main 
        ${isMobile ? 'main-home-register-section-main-mobile' : ''}  `}>
          
          <AccessHome 
            personal={PERSONAL[0]} 
            linkRegister={'/register'}
            linkLogin={'/login'}
            isScrolling={isScrolling}
            />
          <AccessHome 
            personal={PERSONAL[1]} 
            linkRegister={'/register'}
            isScrolling={isScrolling}
            linkLogin={'/login'}
            />
          <AccessHome 
            personal={PERSONAL[2]} 
            linkRegister={'/register'}
            isScrolling={isScrolling}
            linkLogin={'/login'}
            />
        </main>
        <Link to='/login' className='login-link-bottom login-link'>¿Ya tienes cuenta? Inicia sesión</Link>


      </section>
    </main>
  );
};

export default Home;