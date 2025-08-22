import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
const AdminNavbar = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <nav className="small bg-white  shadow-md px-6 py-3 flex justify-between items-center relative">
      {/* Logo */}
      <Link to="/admin-dashboard" className="text-2xl font-bold text-blue-600">
        AdminPortal
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/" className="hover:text-blue-500">
        Home
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

      {/* Mobile menu button */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-14 right-6 bg-white shadow-lg rounded-lg w-48 p-4 flex flex-col space-y-3 md:hidden z-50">
          <Link
            to="/"
            className="hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
          Home
          </Link>
          <Link
            to="/manage-users"
            className="hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Manage Users
          </Link>
          <Link
            to="/manage-products"
            className="hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Manage Products
          </Link>
          <Link
            to="/manage-orders"
            className="hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Manage Orders
          </Link>
          <Link
            to="/profile"
            className="hover:text-blue-500"
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>

          {user && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
