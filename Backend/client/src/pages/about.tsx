
import React from "react";
import '../Styling/about.css';

const AboutPage: React.FC = () => {
  return (
    <div id="about"  className="about-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">About Delala</h1>
        <p className="hero-subtitle">
          Connecting buyers and sellers of cars and houses across Ethiopia.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="mission-vision-section">
        <div className="card mission-card" tabIndex={0}>
          <h2>Our Mission</h2>
          <p>
            To make property and vehicle transactions easier, faster, and more secure,
            connecting people with the right opportunities.
          </p>
        </div>
        <div className="card vision-card" tabIndex={0}>
          <h2>Our Vision</h2>
          <p>
            To be Ethiopia's most trusted platform for buying and selling cars and houses,
            enabling everyone to trade with confidence.
          </p>
        </div>
      </section>

  

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <button
          className="cta-button"
          onClick={() => window.location.href = "/register"}
          aria-label="Join Delala Now"
        >
          Join Now
        </button>
      </section>
    </div>
  );
};

export default AboutPage;
