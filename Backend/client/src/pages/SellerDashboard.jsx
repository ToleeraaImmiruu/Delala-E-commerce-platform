import React, { useEffect, useState } from "react";

const SellerDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerDashboard = async () => {
      const token = localStorage.getItem("token"); // get stored token
      if (!token) return alert("You must be logged in");

      try {
        const res = await fetch("http://localhost:5000/seller-dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // send token
          },
        });

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

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="text-center t-20px">Seller Dashboard</h2>
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
