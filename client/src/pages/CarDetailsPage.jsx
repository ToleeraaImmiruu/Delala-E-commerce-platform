import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import car1 from "../assets/images/car11.jpg";
import car2 from "../assets/images/car12.jpg";

const cars = [
  {
    id: 1,
    name: "Hyundai Elantra 2023",
    frontImage: car1,
    backImage: car2,
    description: `The Hyundai Elantra 2023 is a stylish compact sedan that redefines modern design and innovation. 
    It features a futuristic exterior, enhanced aerodynamics, and a luxurious cabin with cutting-edge technology. 
    The Elantra provides excellent fuel economy and comes equipped with a wide range of driver assistance features 
    such as blind-spot monitoring, forward collision avoidance, and adaptive cruise control. 
    With a smooth ride, excellent handling, and a bold look, the Elantra offers unbeatable value for those seeking 
    a balance of style, comfort, and technology in their daily drives.`
  },
];

const CarDetails = () => {
  const [cart, setCart] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addToCart = (car) => {
    setCart([...cart, car]);
    alert(`${car.name} added to cart!`);
  };

  const handleBack = () => {
    navigate("/"); // redirect to home page
  };

  // Inline styles
  const containerStyle = { maxWidth: 1200, margin: "0 auto", padding: 20 };
  const cardStyle = { border: "1px solid #ccc", borderRadius: 10, padding: isMobile ? 15 : 20, marginBottom: 20, backgroundColor: "#fff" };
  const nameStyle = { fontSize: isMobile ? 18 : 24, fontWeight: "bold", marginBottom: 15 };
  const imagesContainerStyle = { display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 10 : 20, marginBottom: 15 };
  const imageStyle = { width: isMobile ? "100%" : "48%", height: "auto", borderRadius: 10, objectFit: "cover" };
  const descriptionStyle = { fontSize: isMobile ? 14 : 16, lineHeight: 1.5, marginBottom: 15 };
  const buttonStyle = { padding: 10, backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", width: isMobile ? "100%" : "auto", marginBottom: 10 };
  const cartContainerStyle = { marginTop: 30, borderTop: "1px solid #ccc", paddingTop: 20 };

  return (
    <div style={containerStyle}>
       <button
        onClick={handleBack}
        style={{ padding: 10, backgroundColor: "#1976d2", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: "bold", width: isMobile ? "100%" : "auto", marginTop: 20 }}
      >
        Back
      </button>
      {cars.map((car) => (
        <div key={car.id} style={cardStyle}>
          <h2 style={nameStyle}>{car.name}</h2>
          <div style={imagesContainerStyle}>
            <img src={car.frontImage} alt={`${car.name} front`} style={imageStyle} />
            <img src={car.backImage} alt={`${car.name} back`} style={imageStyle} />
          </div>
          <p style={descriptionStyle}>{car.description}</p>
          <button style={buttonStyle} onClick={() => addToCart(car)}>Add to Cart</button>
        </div>
      ))}

    

     
    </div>
  );
};

export default CarDetails;
