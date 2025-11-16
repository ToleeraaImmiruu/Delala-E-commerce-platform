import React, { useEffect, useState } from "react";

const PublicProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://delala-e-commerce-backend.onrender.com/api/allCar"
      );
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
      const res = await fetch(
        "https://delala-e-commerce-backend.onrender.com/api/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ carId: product._id, quantity: 1 }),
        }
      );
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

  if (loading) return <p>Loading...</p>;

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
            {/* ---------- IMAGE FIX ---------- */}
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  background: "#eee",
                  borderRadius: "8px",
                }}
              >
                No Image
              </div>
            )}

            <div style={{ marginTop: "10px" }}>
              {/* ML MODEL FIELDS */}
              <h3>{product.name}</h3>

              <p>
                <strong>Predicted Price:</strong> ${product.predictedPrice}
              </p>

              <p>
                <strong>Year:</strong> {product.year}
              </p>

              <p>
                <strong>Owner:</strong> {product.owner}
              </p>

              <div style={{ marginTop: "10px" }}>
                <button
                  style={{
                    padding: "6px 12px",
                    margin: "5px",
                    backgroundColor: "#1976d2",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "120px",
                  }}
                  onClick={() => alert("View Details")}
                >
                  View Details
                </button>

                <button
                  style={{
                    padding: "6px 12px",
                    margin: "5px",
                    backgroundColor: "#ff9800",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "120px",
                  }}
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
