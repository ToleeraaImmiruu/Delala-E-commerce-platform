import React, { useState } from 'react';
import "../Styling/Navbar.css";
import { FaShoppingCart, FaBars, FaTimes ,FaSearch} from "react-icons/fa";
import Logo from "../assets/images/DELALA.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img className='Logo-image' src={Logo} alt="logo" />
        Dalala<span>.com</span>
      </div>

      {/* Search Bar */}
      <div className="navbar-search">
        <FaSearch className="search-icon " />
        <input type="text" placeholder="Search cars..." />
      </div>

      {/* Hamburger Icon (Mobile) */}
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Links */}
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li><a href="#home" onClick={toggleMenu}>Home</a></li>
        <li><a href="#about" onClick={toggleMenu}>About</a></li>
        <li><a href="#services" onClick={toggleMenu}>Services</a></li>
        <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
        <li className="cart" onClick={toggleMenu}>
          <FaShoppingCart className="cart-icon" />
        </li>
        <li>
          <button className="login-btn" onClick={toggleMenu}>Login</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
