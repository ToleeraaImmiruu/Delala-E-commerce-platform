import React, { useState } from 'react';
import "../Styling/Navbar.css";
import { FaShoppingCart, FaBars, FaTimes ,FaSearch} from "react-icons/fa";
import Logo from "../assets/images/DELALA.png";
import { useNavigate,Link } from "react-router-dom"
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img className='Logo-image' src={Logo} alt="logo" />
      <a href="#home"  onClick={(e) => {
      e.preventDefault();       
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    }}> Dalala<span>.com</span> </a> 
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
<li>
  <Link to="/seller-dashboard">
    Seller
  </Link>
</li>
<li>
  <Link to="/seller-dashboard">
    Buyer 
  </Link>
</li>
        
        <li><a href="#service" onClick={toggleMenu}>Services</a></li>
        <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
        <li className="cart" onClick={toggleMenu}>
          <FaShoppingCart className="cart-icon" />
        </li>
     <li>
      <button className="login-btn1" onClick={handleLoginClick}>
        Login
      </button>
    </li>
      </ul>
    </nav>
  );
}
  
export default Navbar;
