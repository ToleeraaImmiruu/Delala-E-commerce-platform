import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const SellerNavbar = ({ user, setUser, setToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        SellerPortal
      </Link>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/upload" className="hover:text-blue-500">
          Upload
        </Link>
        <Link to="/seller-orders" className="hover:text-blue-500">
          Orders
        </Link>
        <Link to="/profile" className="hover:text-blue-500">
          Profile
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
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 space-y-4 md:hidden">
          <Link
            to="/upload"
            className="hover:text-blue-500"
            onClick={() => setIsOpen(false)}
          >
            Upload
          </Link>
          <Link
            to="/seller-orders"
            className="hover:text-blue-500"
            onClick={() => setIsOpen(false)}
          >
            Orders
          </Link>
          <Link
            to="/profile"
            className="hover:text-blue-500"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>

          {user && (
            <div className="flex flex-col space-y-2 w-full">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-700">
                  Welcome, {user.username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
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

export default SellerNavbar;
