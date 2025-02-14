import React from 'react';
import './styles/Home.css';
import AchievementHome from '../components/AchievementHome.jsx';
import { Link } from 'react-router-dom';
import AccessHome from '../components/AccessHome.jsx';
import SliderHome from '../components/SliderHome.jsx';
const Home = ({isMobile}) => {
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
          <Link
              to="/register"
              className='app-link register-link register-link-home'>
              INSCRÍBETE
            </Link>

        </article>

      </section>
      <section className='main-home-slider'>
        <h2 className={isMobile ? 'main-home-slider-title main-home-slider-title-mobile'
                                : 'main-home-slider-title'}>
          DESCUBRE NUESTRAS INSTALACIONES</h2>
        <SliderHome isMobile={isMobile}/>
      </section>
      <section className='main-home-register-section'>
        <AccessHome isMobile={isMobile}></AccessHome>
        <AccessHome isMobile={isMobile}></AccessHome>
        <AccessHome isMobile={isMobile}></AccessHome>

      </section>
    </main>
  );
};

export default Home;