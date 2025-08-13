import React from "react";

const BuyerDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome, {user?.username || "Buyer"}</h1>
      <p>This is your dashboard.</p>
    </div>
  );
};

export default BuyerDashboard;
