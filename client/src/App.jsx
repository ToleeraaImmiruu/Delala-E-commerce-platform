import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import BuyerNavbar from "./components/BuyerNavbar";
import SellerNavbar from "./components/SellerNavbar";
import AdminNavbar from "./components/AdminNavbar";
import LandingPage from "./pages/LandingPage";
import Services from "./pages/services";
import About from "./pages/about";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import Register from "./pages/Register";
import LoginPage from "./pages/Login";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // ProtectedRoute wrapper
  const ProtectedRoute = ({ children, role }) => {
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Home / Landing */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
              <Services />
              <Contact />
              <About />
              <Footer />
            </>
          }
        />
        {/* profile  */}
        <Route
  path="/profile"
  element={
    <ProtectedRoute role={user?.role}>
      <Profile />
    </ProtectedRoute>
  }
/>
        {/* Register */}
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <LoginPage setToken={setToken} setUser={setUser} />
            </>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
               <AdminNavbar user={user} setUser={setUser} setToken={setToken} />
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Seller dashboard */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute role="seller">
            <SellerNavbar user={user} setUser={setUser} setToken={setToken} />
              <SellerDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Buyer dashboard */}
        <Route
          path="/buyer-dashboard"
          element={
           <ProtectedRoute role={["seller", "admin"]}>

              <BuyerNavbar user={user} setUser={setUser} setToken={setToken} />
              <BuyerDashboard user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
