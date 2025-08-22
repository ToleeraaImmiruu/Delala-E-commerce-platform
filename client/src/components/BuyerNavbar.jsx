import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons for mobile menu

const BuyerNavbar = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Delala.com
      </Link>

      {/* Hamburger (visible on small screens only) */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Links (desktop view) */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/" className="hover:text-blue-500">
          Home
        </Link>
        <Link to="/myOrders" className="hover:text-blue-500">
          Orders
        </Link>
        <Link to="/profile" className="hover:text-blue-500">
          Profile
        </Link>
        <Link to="/cart" className="hover:text-blue-500">
          Cart
        </Link>

        {user && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium text-gray-700">
              Welcome, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile menu (shown when hamburger is clicked) */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-3 py-4 md:hidden z-50">
          <Link to="/" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/myOrders" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>
            Orders
          </Link>
          <Link to="/profile" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
          <Link to="/cart" className="hover:text-blue-500" onClick={() => setIsOpen(false)}>
            Cart
          </Link>

          {user && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-700">
                Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default BuyerNavbar;
