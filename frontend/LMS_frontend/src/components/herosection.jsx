import React  from "react";
import './herosection.css';



const HeroSection = ({User}) =>{
  return(
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Master English with <span className="highlight">Dr. Mina</span>
        </h1>
        <p className="hero-subtitle">join successful learners today who have transformed their lives through proven teaching methodology
        </p>
        <div className="hero-buttons">
          {User ?(
            <button className="btn btn-primary">My courses</button>
            ):(
              <>
              <button className="btn btn-primary">start free trial</button>
              <button className="btn btn-secondary"> watch Demo</button>
              </>
            )}
                </div>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">years of experience</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">98%</span>
                    <span className="stat-label">success rate</span>
                  </div>
                </div>
              </div>
              <div className="hero-image">
                <div className="image-placeholder">
                    learn english
                </div>
              </div>
            </section>
  );
};
export default HeroSection;