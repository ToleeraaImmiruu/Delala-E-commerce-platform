import React, { useEffect, useState } from "react";

const SellerDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerDashboard = async () => {
      const token = localStorage.getItem("token"); // get stored token
      if (!token) return alert("You must be logged in");

      try {
        const res = await fetch(
          "https://delala-e-commerce-backend.onrender.com/seller-dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // send token
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard");

        setDashboardData(data); // save data to state
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDashboard();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-center text-2xl font-bold mb-4">Seller Dashboard</h2>
      {dashboardData ? (
        <div>
          <p>{dashboardData.message}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default SellerDashboard;
