import React from "react";
import "../Styling/Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaCar } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand Section */}
        <div className="footer-section">
          <h2 className="footer-logo"><FaCar /> CarMarket</h2>
          <p>Your trusted platform to buy, sell, and explore cars from all over Ethiopia and beyond.</p>
        </div>

        {/* Car Types / Info */}
        <div className="footer-section">
          <h3>Car Types</h3>
          <ul>
            <li>SUVs</li>
            <li>Sedans</li>
            <li>Hatchbacks</li>
            <li>Trucks</li>
            <li>Electric Vehicles</li>
          </ul>
        </div>

        {/* Info Links */}
        <div className="footer-section">
          <h3>Car Guides</h3>
          <ul>
            <li>Buying Tips</li>
            <li>Maintenance Advice</li>
            <li>Latest Car Trends</li>
            <li>Loan & Finance Options</li>
            <li>Insurance Info</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Addis Ababa, Ethiopia</p>
          <p>📧 info@carmarket.com</p>
          <p>📞 +251 900 000 000</p>

          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CarMarket. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
