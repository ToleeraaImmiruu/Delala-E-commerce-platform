import React, { useEffect, useState } from "react";
import "../Styling/BuyerDashboard.css";

const PublicProducts = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: "", location: "", type: "", images: [] });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch("https://delala-e-commerce-backend.onrender.com/api/public", {
      headers: { Authorization: `Bearer ${token}` },
    })
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`https://delala-e-commerce-backend.onrender.com/api/delete1/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete product");
    }
  };

  const startEditing = (product) => {
    setEditingId(product._id);
    setEditData({
      name: product.name,
      price: product.price,
      location: product.location,
      type: product.type,
      images: product.images || [],
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`https://delala-e-commerce-backend.onrender.com/api/edit1/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      const data = await res.json();
      if (data.success) {
        alert("Product updated successfully");
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

  // Inline styles for buttons
  const buttonStyle = {
    padding: "8px 10px",
    margin: "5px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#4CAF50",
    color: "#fff",
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#f44336",
    color: "#fff",
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2196F3",
    color: "#fff",
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#777",
    color: "#fff",
  };

  return (
    <div className="ImageGallery22">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="CarCard2">
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt={product.name} className="GalleryImage2" />
            )}

            <div className="CarDetails2">
              {editingId === product._id ? (
                <div className="EditForm">
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleEditChange}
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="location"
                    value={editData.location}
                    onChange={handleEditChange}
                    placeholder="Location"
                  />
                  <input
                    type="text"
                    name="type"
                    value={editData.type}
                    onChange={handleEditChange}
                    placeholder="Type"
                  />
                  <button style={saveButtonStyle} onClick={() => handleEditSubmit(product._id)}>Save</button>
                  <button style={cancelButtonStyle} onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h3>{product.name}</h3>
                  <p><strong>Price:</strong> ${product.price}</p>
                  <p><strong>Location:</strong> {product.location}</p>
                  <p><strong>Type:</strong> {product.type}</p>
                  <button style={{ ...buttonStyle, backgroundColor: "#ff9800", color: "#fff"  }}>View Details</button>

                  {/* Edit/Delete buttons for the seller */}
                  {currentUser && String(product.sellerId) === String(currentUser.id || currentUser._id) && (
                    <>
                      <button style={editButtonStyle} onClick={() => startEditing(product)}>Edit</button>
                      <button style={deleteButtonStyle} onClick={() => handleDelete(product._id)}>Delete</button>
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
