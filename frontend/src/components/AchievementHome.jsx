import React from "react";
import "./styles/AchievementHome.css";

const AchievementHome = ({ children, isMobile }) => {
  return (
    <p className={isMobile ? "achievement-home achievement-home-mobile" : "achievement-home"}>
        {children}
    </p>
  );
};

export default AchievementHome;