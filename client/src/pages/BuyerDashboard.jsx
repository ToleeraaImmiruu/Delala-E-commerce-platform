import React, { useEffect, useState } from "react";
import "../Styling/BuyerDashboard.css"; // external CSS

const PublicProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const token = localStorage.getItem("token"); // for authenticated requests

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/public");
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      alert("Please login to add items to cart!");
      return;
    }
    setCartLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carId: product._id, quantity: 1 }),
      });
      const data = await res.json();
      if (data.cart) {
        alert("Item added to cart successfully!");
      } else {
        alert(data.message || "Failed to add item to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
    setCartLoading(false);
  };

  if (loading) return <p>Loading products...</p>;

  // Button inline styles
  const buttonBaseStyle = {
    padding: "6px 12px",
    margin: "5px 5px 0 0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "120px", // smaller width
    transition: "all 0.3s ease",
  };

  const viewButtonStyle = { ...buttonBaseStyle, backgroundColor: "#1976d2", color: "#fff" }; // blue
  const addCartButtonStyle = { ...buttonBaseStyle, backgroundColor: "#ff9800", color: "#fff" }; // orange

  return (
    <div className="ImageGallery22">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="CarCard2">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="GalleryImage2"
              />
            )}
            <div className="CarDetails2">
              <h3>{product.name}</h3>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Location:</strong> {product.location}</p>
              <p><strong>Type:</strong> {product.type}</p>

              <div className="buttonGroup">
                <button
                  style={viewButtonStyle}
                  onClick={() => alert("View details clicked!")}
                >
                  View Details
                </button>
                <button
                  style={addCartButtonStyle}
                  onClick={() => handleAddToCart(product)}
                  disabled={cartLoading}
                >
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicProducts;
