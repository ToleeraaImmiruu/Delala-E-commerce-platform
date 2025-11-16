import React, { useEffect, useState } from "react";
import "../Styling/BuyerDashboard.css";

const PublicProducts = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    year: "",
    km_driven: "",
    fuel: "",
    owner: "",
    seats: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  // ---------------- Fetch All Products ----------------
  const fetchProducts = () => {
    setLoading(true);
    fetch("https://delala-e-commerce-backend.onrender.com/api/allCar")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  // ---------------- Delete Product ----------------
  const handleDelete = async (carId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        "https://delala-e-commerce-backend.onrender.com/api/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ carId }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Product deleted");
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  // ---------------- Start Editing ----------------
  const startEditing = (product) => {
    setEditingId(product._id);

    setEditData({
      name: product.name,
      year: product.year,
      km_driven: product.km_driven,
      fuel: product.fuel,
      owner: product.owner,
      seats: product.seats,
    });
  };

  // ---------------- Input Change ----------------
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- Save Edited Product ----------------
  const handleEditSubmit = async (carId) => {
    try {
      const res = await fetch(
        `https://delala-e-commerce-backend.onrender.com/api/edit/${carId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Product updated");
        setEditingId(null);
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to update product");
    }
  };

  if (loading) return <p>Loading products...</p>;

  // Button Style
  const btn = {
    padding: "8px 10px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div className="ImageGallery22">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((p) => (
          <div key={p._id} className="CarCard2">

            {/* ---------- Image ---------- */}
           {p.images && p.images.length > 0 ? (
  <img
    src={p.images[0].url}
    alt={p.name}
    className="GalleryImage2"
  />
) : (
  <div className="GalleryImage2 NoImageBox">No Image</div>
)}


            <div className="CarDetails2">
              {/* ---------- EDIT MODE ---------- */}
              {editingId === p._id ? (
                <div className="EditForm">
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />
                  <input
                    name="year"
                    value={editData.year}
                    onChange={handleEditChange}
                  />
                  <input
                    name="km_driven"
                    value={editData.km_driven}
                    onChange={handleEditChange}
                  />
                  <input
                    name="fuel"
                    value={editData.fuel}
                    onChange={handleEditChange}
                  />
                  <input
                    name="owner"
                    value={editData.owner}
                    onChange={handleEditChange}
                  />
                  <input
                    name="seats"
                    value={editData.seats}
                    onChange={handleEditChange}
                  />

                  <button
                    style={{ ...btn, background: "#2196F3", color: "white" }}
                    onClick={() => handleEditSubmit(p._id)}
                  >
                    Save
                  </button>

                  <button
                    style={{ ...btn, background: "#555", color: "white" }}
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* ---------- SHOW MODE ---------- */
                <div>
                
                  <h3><strong>Name:</strong> {p.name}</h3>
                  <p><strong>Price:</strong> {p.predictedPrice}</p>
                  <p><strong>Year:</strong> {p.year}</p>
                  <p><strong>KM Driven:</strong> {p.km_driven}</p>
                  <p><strong>Fuel:</strong> {p.fuel}</p>
                  <p><strong>Owner:</strong> {p.owner}</p>
                  <p><strong>Seats:</strong> {p.seats}</p>

                  <button
                    style={{ ...btn, background: "#ff9800", color: "#fff" }}
                  >
                    View Details
                  </button>

                  {/* ---------- Only Seller Can Edit/Delete ---------- */}
                  {currentUser &&
                    String(p.sellerId) ===
                      String(currentUser._id || currentUser.id) && (
                      <>
                        <button
                          style={{
                            ...btn,
                            background: "#4CAF50",
                            color: "#fff",
                          }}
                          onClick={() => startEditing(p)}
                        >
                          Edit
                        </button>

                        <button
                          style={{
                            ...btn,
                            background: "#f44336",
                            color: "#fff",
                          }}
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicProducts;
