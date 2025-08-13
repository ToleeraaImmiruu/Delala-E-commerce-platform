import React, { useEffect, useState } from "react";

const BuyerDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyerDashboard = async () => {
      const token = localStorage.getItem("token"); // Get stored token
      if (!token) return alert("You must be logged in");

      try {
        const res = await fetch("http://localhost:5000/buyer-dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch dashboard");

        setDashboardData(data); // Save data to state
      } catch (err) {
        console.error(err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuyerDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2>Buyer Dashboard</h2>
      {dashboardData ? (
        <div>
          <p>{dashboardData.message}</p>
          <p>Welcome, {user?.username}!</p>
          {/* Buyer-specific UI: e.g., product listings, orders, etc. */}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default BuyerDashboard;
