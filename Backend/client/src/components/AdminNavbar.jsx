import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = ({ user, setUser, setToken }) => {
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
      <Link to="/admin-dashboard" className="text-2xl font-bold text-blue-600">
        AdminPortal
      </Link>

      {/* Navigation links */}
      <div className="flex items-center space-x-4">
        <Link to="/admin-dashboard" className="hover:text-blue-500">
          Dashboard
        </Link>
        <Link to="/manage-users" className="hover:text-blue-500">
          Manage Users
        </Link>
        <Link to="/manage-products" className="hover:text-blue-500">
          Manage Products
        </Link>
        <Link to="/manage-orders" className="hover:text-blue-500">
          Manage Orders
        </Link>
        <Link to="/profile" className="hover:text-blue-500">
          Profile
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

export default AdminNavbar;
