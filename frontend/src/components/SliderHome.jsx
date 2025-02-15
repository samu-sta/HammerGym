import React from "react";
import "./styles/SliderHome.css";


const SliderHome = ({isMobile}) => {
  return (
    <div className={isMobile ? 'slider-frame slider-frame-mobile' : 'slider-frame'}>
        <ul>
          <li><img src="/carrusel/1.png" alt=""/></li>
          <li><img src="/carrusel/2.png" alt=""/></li>
          <li><img src="/carrusel/3.png" alt=""/></li>
          <li><img src="/carrusel/4.png" alt=""/></li>
          <li><img src="/carrusel/5.png" alt=""/></li>
          <li><img src="/carrusel/6.png" alt=""/></li>
          <li><img src="/carrusel/7.png" alt=""/></li>
          <li><img src="/carrusel/8.png" alt=""/></li>
          <li><img src="/carrusel/9.png" alt=""/></li>
          <li><img src="/carrusel/10.png" alt=""/></li>
          <li><img src="/carrusel/11.png" alt=""/></li>
          <li><img src="/carrusel/12.png" alt=""/></li>
        </ul>
      </div>
  );
};

export default SliderHome;