import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BuyerNavbar = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();

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

      {/* Navigation links */}
      <div className="flex items-center space-x-4">
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

        {/* User info + Logout */}
        {user && (
          <div className="flex items-center space-x-2">
            {/* Profile picture placeholder */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Welcome message */}
            <span className="font-medium text-gray-700">
              Welcome, {user.username}
            </span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BuyerNavbar;
