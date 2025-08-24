import React, { useState, useEffect } from "react";
import Car2 from "../assets/images/car2.avif";
import { useNavigate } from "react-router-dom";

const carData = [
  { id: 1, model: "Toyota Corolla", price: "$12,000", location: "Addis Ababa", type: "Sedan", image: Car2, btn: "View Details" },
  { id: 2, model: "Hyundai Tucson", price: "$18,500", location: "Adama", type: "SUV", image: Car2, btn: "View Details" },
  { id: 3, model: "Suzuki Alto", price: "$7,200", location: "Hawassa", type: "Compact", image: Car2, btn: "View Details" },
  { id: 4, model: "Nissan X-Trail", price: "$15,900", location: "Bahir Dar", type: "SUV", image: Car2, btn: "View Details" },
];

const carData2 = [
  { id: 5, model: "Honda Civic", price: "$14,800", location: "Mekelle", type: "Sedan", image: Car2, btn: "View Details" },
  { id: 6, model: "Ford Ranger", price: "$25,500", location: "Dire Dawa", type: "Pickup", image: Car2, btn: "View Details" },
  { id: 7, model: "Kia Sportage", price: "$21,200", location: "Gondar", type: "SUV", image: Car2, btn: "View Details" },
  { id: 8, model: "BMW 320i", price: "$32,000", location: "Jimma", type: "Luxury Sedan", image: Car2, btn: "View Details" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [cars1, setCars1] = useState([]);
  const [cars2, setCars2] = useState([]);

  useEffect(() => {
    // Simulate API fetch with delay
    setTimeout(() => {
      setCars1(carData);
      setCars2(carData2);
      setLoading(false);
    }, 1500);
  }, []);

  const handleRedirect = () => {
    if (token) {
      navigate("/detail");
    } else {
      alert("Please login first!");
    }
  };

  const handleAddToCart = (car) => {
    if (!token) {
      navigate("/login");
    } else {
      alert(`${car.model} added to cart!`);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#f9f9f9" }}>
      {/* Spinner Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #007bff",
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`@keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }`}
          </style>
        </div>
      )}

      {/* Landing Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem", background: "#fff" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0, color: "#333" }}>
            "Skip the Stress."
          </h1>
          <span style={{ fontSize: "1.2rem", color: "#007bff" }}>
            Fast, Secure, and Hassle-Free.
          </span>
        </div>
        <img src={Car2} alt="Car" style={{ width: "300px", borderRadius: "10px" }} />
      </div>

      {/* Car List 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", padding: "2rem" }}>
        {cars1.map((car) => (
          <div
            key={car.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <img src={car.image} alt={car.model} style={{ width: "100%", borderRadius: "8px" }} />
            <h3>{car.model}</h3>
            <p><strong>Price:</strong> {car.price}</p>
            <p><strong>Location:</strong> {car.location}</p>
            <p><strong>Type:</strong> {car.type}</p>
            <button
              onClick={handleRedirect}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "8px 12px",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              {car.btn}
            </button>
            {token && (
              <button
                onClick={() => handleAddToCart(car)}
                style={{
                  background: "green",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  margin: "5px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Car List 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", padding: "2rem" }}>
        {cars2.map((car) => (
          <div
            key={car.id}
            style={{
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            <img src={car.image} alt={car.model} style={{ width: "100%", borderRadius: "8px" }} />
            <h3>{car.model}</h3>
            <p><strong>Price:</strong> {car.price}</p>
            <p><strong>Location:</strong> {car.location}</p>
            <p><strong>Type:</strong> {car.type}</p>
            <button
              onClick={handleRedirect}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                padding: "8px 12px",
                margin: "5px",
                cursor: "pointer",
              }}
            >
              {car.btn}
            </button>
            {token && (
              <button
                onClick={() => handleAddToCart(car)}
                style={{
                  background: "green",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  margin: "5px",
                  cursor: "pointer",
                }}
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
