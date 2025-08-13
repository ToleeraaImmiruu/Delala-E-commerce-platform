import React from "react";

const AdminDashboard = ({ user }) => {
  return (
    <div>
      <h1>Welcome Admin, {user?.username || "Admin"}</h1>
      <p>This is the admin dashboard.</p>
    </div>
  );
};

export default AdminDashboard;
