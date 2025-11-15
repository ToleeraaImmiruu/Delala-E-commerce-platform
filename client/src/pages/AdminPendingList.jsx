import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchPendingProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://delala-e-commerce-backend.onrender.com/api/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
    if (!window.confirm("Approve this product?")) return;
    try {
      const res = await fetch(
        `https://delala-e-commerce-backend.onrender.com/api/approve-product/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("✅ Product approved");
        setPendingProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const rejectProduct = async (id) => {
    if (!window.confirm("Reject this product?")) return;
    try {
      const res = await fetch(
        `https://delala-e-commerce-backend.onrender.com/api/reject-product/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes: "Rejected by admin" }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("❌ Product rejected");
        setPendingProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Pending Listings</h2>

      {pendingProducts.length === 0 ? (
        <p className="text-gray-500">No pending products.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {pendingProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex-shrink-0">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full sm:w-24 h-24 object-cover rounded border"
                  />
                ) : (
                  <div className="w-full sm:w-24 h-24 bg-gray-100 flex items-center justify-center rounded border">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 mt-2 sm:mt-0">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-green-600 font-bold">
                  ${Number(product.predictedPrice).toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm">Fuel: {product.fuel}</p>
                <p
                  className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                    product.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : product.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.status}
                </p>
              </div>
              <div className="flex gap-2 mt-3 sm:mt-0 sm:flex-col sm:justify-center">
                <button
                  onClick={() => approveProduct(product._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 w-full sm:w-auto"
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectProduct(product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
