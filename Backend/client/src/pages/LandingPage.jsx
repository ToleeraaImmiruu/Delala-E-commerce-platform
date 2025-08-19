import React from "react";
import "../Styling/LandingPage.css";
import Car2 from "../assets/images/car2.avif";
import { useNavigate } from "react-router-dom";

const carData = [
  {
    id: 1,
    model: "Toyota Corolla",
    price: "$12,000",
    location: "Addis Ababa",
    type: "Sedan",
    image: Car2,
    btn: "View Details",
  },
  {
    id: 2,
    model: "Hyundai Tucson",
    price: "$18,500",
    location: "Adama",
    type: "SUV",
    image: Car2,
    btn: "View Details",
  },
  {
    id: 3,
    model: "Suzuki Alto",
    price: "$7,200",
    location: "Hawassa",
    type: "Compact",
    image: Car2,
    btn: "View Details",
  },
  {
    id: 4,
    model: "Nissan X-Trail",
    price: "$15,900",
    location: "Bahir Dar",
    type: "SUV",
    image: Car2,
    btn: "View Details",
  },
];

const carData2 = [
  {
    id: 5,
    model: "Honda Civic",
    price: "$14,800",
    location: "Mekelle",
    type: "Sedan",
    image: Car2,
    btn: "View Details",
  },
  {
    id: 6,
    model: "Ford Ranger",
    price: "$25,500",
    location: "Dire Dawa",
    type: "Pickup",
    image: Car2,
    btn: "View Details",
  },
  {
    id: 7,
    model: "Kia Sportage",
    price: "$21,200",
    location: "Gondar",
    type: "SUV",
    image: Car2,
    btn: "View Details",
  },
  {
    id: 8,
    model: "BMW 320i",
    price: "$32,000",
    location: "Jimma",
    type: "Luxury Sedan",
    image: Car2,
    btn: "View Details",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check login status

  const handleRedirect = () => {
    navigate("/login");
  };

  const handleAddToCart = (car) => {
    if (!token) {
      navigate("/login");
    } else {
      alert(`${car.model} added to cart!`);
      // Here you can call your backend API to add to cart
    }
  };

  return (
    <div id="home" className="HomePage">
      <div className="LandingPage">
        <div className="LandingText">
          <h1>"Skip the Stress. </h1>
          <span className="LandingSpan"> Fast, Secure, and Hassle-Free."</span>
        </div>
        <img src={Car2} alt="car Image" className="LandingImage" />
      </div>

      {/* First car list */}
      <div className="ImageGallery">
        {carData.map((car) => (
          <div key={car.id} className="CarCard">
            <img src={car.image} alt={car.model} className="GalleryImage" />
            <div className="CarDetails">
              <h3>{car.model}</h3>
              <p>
                <strong>Price:</strong> {car.price}
              </p>
              <p>
                <strong>Location:</strong> {car.location}
              </p>
              <p>
                <strong>Type:</strong> {car.type}
              </p>
              <button className="btn view-btn" onClick={handleRedirect}>
                {car.btn}
              </button>
              {token && (
                <button
                  className=" add-cart-btn"
                  onClick={() => handleAddToCart(car)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Second car list */}
      <div className="ImageGallery22">
        {carData2.map((car) => (
          <div key={car.id} className="CarCard2">
            <img src={car.image} alt={car.model} className="GalleryImage2" />
            <div className="CarDetails2">
              <h3>{car.model}</h3>
              <p>
                <strong>Price:</strong> {car.price}
              </p>
              <p>
                <strong>Location:</strong> {car.location}
              </p>
              <p>
                <strong>Type:</strong> {car.type}
              </p>
              <button className="btn view-btn" onClick={handleRedirect}>
                {car.btn}
              </button>
              {token && (
                <button
                  className="btn add-cart-btn"
                  onClick={() => handleAddToCart(car)}
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
