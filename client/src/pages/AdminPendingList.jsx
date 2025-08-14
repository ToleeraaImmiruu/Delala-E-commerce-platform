import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPendingProducts(data.pending);
      else setPendingProducts([]);
    } catch (error) {
      console.error("Error fetching pending products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const approveProduct = async (id) => {
    if (!window.confirm("Are you sure you want to approve this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/approve-product/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Product approved");
        // Remove from frontend list instantly
        setPendingProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(`❌ Failed to approve product: ${data.message}`);
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const rejectProduct = async (id) => {
    if (!window.confirm("Are you sure you want to reject this product?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/reject-product/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: "Rejected by admin" }), // optional notes
      });
      const data = await res.json();
      if (data.success) {
        alert("❌ Product rejected");
        // Remove from frontend list instantly
        setPendingProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(`❌ Failed to reject product: ${data.message}`);
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) return <p>Loading pending products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Listings</h2>

      {pendingProducts.length === 0 ? (
        <p>No pending products.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Location</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Images</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingProducts.map((product) => (
              <tr key={product._id}>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">{product.location}</td>
                <td className="border p-2">{product.type}</td>
                <td className="border p-2 flex gap-2">
                  {product.images?.map((img) => (
                    <img
                      key={img._id}
                      src={img.url}
                      alt={product.name}
                      className="w-20 h-16 object-cover border"
                    />
                  ))}
                </td>
                <td className="border p-2">{product.status}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => approveProduct(product._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectProduct(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
