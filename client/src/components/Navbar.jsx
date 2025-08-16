import React, { useState } from "react";
import "../Styling/Navbar.css";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import Logo from "../assets/images/DELALA.png";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ onSearch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      if (onSearch) onSearch(query);
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img className="Logo-image" src={Logo} alt="logo" />
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Dalala<span>.com</span>
        </a>
      </div>

      {/* Search Bar */}
    <div className="navbar-search">
  <form onSubmit={handleSearch} className="search-form">
    <button type="submit" style={{ background: "none", border: "none", cursor: "pointer" }}>
      <FaSearch className="search-icon" />
    </button>
    <input
      type="text"
      placeholder="Search cars..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  </form>
</div>



      {/* Hamburger Icon (Mobile) */}
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Links */}
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li>
          <Link to="/seller-dashboard">Seller</Link>
        </li>
        <li>
          <Link to="/buyer-dashboard">Buyer</Link>
        </li>
        <li>
          <a href="#service" onClick={toggleMenu}>
            Services
          </a>
        </li>
        <li>
          <a href="#contact" onClick={toggleMenu}>
            Contact Us
          </a>
        </li>
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
