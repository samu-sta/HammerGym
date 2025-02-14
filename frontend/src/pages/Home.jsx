import React from 'react';
import './styles/Home.css';
import AchievementHome from '../components/AchievementHome.jsx';
import { Link } from 'react-router-dom';
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
    </main>
  );
};

export default Home;