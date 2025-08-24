import React, { useEffect, useState } from "react";

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
      const res = await fetch("https://delala-e-commerce-backend.onrender.com/api/public");
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
      const res = await fetch("https://delala-e-commerce-backend.onrender.com/api/add", {
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

  // Loader (circle spinner) inline style
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  };

  const spinnerStyle = {
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #1976d2",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  };

  // Button inline styles
  const buttonBaseStyle = {
    padding: "6px 12px",
    margin: "5px 5px 0 0",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "120px",
    transition: "all 0.3s ease",
  };

  const viewButtonStyle = { ...buttonBaseStyle, backgroundColor: "#1976d2", color: "#fff" };
  const addCartButtonStyle = { ...buttonBaseStyle, backgroundColor: "#ff9800", color: "#fff" };

  if (loading) {
    return (
      <div style={loaderStyle}>
        <div
          style={spinnerStyle}
          // Add inline keyframes using CSS injection
          dangerouslySetInnerHTML={{
            __html: `<style>@keyframes spin {0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }</style>`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
              />
            )}
            <div style={{ marginTop: "10px" }}>
              <h3 style={{ margin: "8px 0" }}>{product.name}</h3>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Location:</strong> {product.location}</p>
              <p><strong>Type:</strong> {product.type}</p>

              <div style={{ marginTop: "10px" }}>
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
