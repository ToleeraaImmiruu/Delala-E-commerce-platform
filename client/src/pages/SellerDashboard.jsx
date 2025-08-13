import React from "react";

const SellerDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user?.username || "Seller"}</h1>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default SellerDashboard;
