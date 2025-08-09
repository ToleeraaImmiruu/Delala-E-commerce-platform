import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Services from "./pages/services";
import About from "./pages/about";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
     
      <Routes>
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
        <Route
          path="/register"
          element={
              <>
           <Navbar />
            <Register />
    </>
          }
        />
        <Route
          path="/login"
          element={
              <>
            <Navbar />
            <Login />
    </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
