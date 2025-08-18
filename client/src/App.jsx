import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Navbars
import Navbar from "./components/Navbar";
import BuyerNavbar from "./components/BuyerNavbar";
import SellerNavbar from "./components/SellerNavbar";
import AdminNavbar from "./components/AdminNavbar";

// Pages
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
import AdminManager from "./pages/AdminPendingList";
import Upload from "./pages/uploadSeller";
import FetchPublic from "./pages/FeatchingPublic";
import SearchResults from "./pages/SearchResults";
import AdminUsers from "./pages/UserManagment";
import Cart from "./pages/Cart";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // ProtectedRoute wrapper
  const ProtectedRoute = ({ children, role }) => {
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    if (!currentUser) return <Navigate to="/login" replace />;

    // Admin can access all dashboards
    if (role && currentUser.role !== role && currentUser.role !== "admin")
      return <Navigate to="/" replace />;

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
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />

        {/* Profile */}
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
              <AdminManager />
              <AdminUsers />
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
      {/* Pass currentUser prop here */}
      <FetchPublic currentUser={user} />
    </ProtectedRoute>
  }
/>

        <Route
          path="/upload"
          element={
            <ProtectedRoute role="seller">
              <SellerNavbar user={user} setUser={setUser} setToken={setToken} />
                  
              <Upload  user={user}/>
            </ProtectedRoute>
          }
        />

        {/* Buyer dashboard */}
        <Route
          path="/buyer-dashboard"
          element={
            <ProtectedRoute role="buyer">
              <BuyerNavbar user={user} setUser={setUser} setToken={setToken} />
              <BuyerDashboard user={user} />
            {/* <FetchPublic/> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
export default App;
