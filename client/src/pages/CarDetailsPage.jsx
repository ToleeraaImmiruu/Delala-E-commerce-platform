import React, { useState } from "react";
import "../Styling/CarDetails.css";
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

  const addToCart = (car) => {
    setCart([...cart, car]);
    alert(`${car.name} added to cart!`);
  };

  return (
    <div className="car-details-container">
      {cars.map((car) => (
        <div key={car.id} className="car-card">
          <h2 className="car-name">{car.name}</h2>
          <div className="car-images">
            <img src={car.frontImage} alt={`${car.name} front`} className="car-image" />
            <img src={car.backImage} alt={`${car.name} back`} className="car-image" />
          </div>
          <p className="car-description">{car.description}</p>
          <button className="add-to-cart-btn" onClick={() => addToCart(car)}>
            Add to Cart
          </button>
        </div>
      ))}

      <div className="cart-container">
        <h3>🛒 Cart</h3>
        {cart.length === 0 ? (
          <p>No cars in cart</p>
        ) : (
          <ul>
            {cart.map((car, index) => (
              <li key={index}>{car.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CarDetails;
