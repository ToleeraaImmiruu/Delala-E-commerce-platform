import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // show spinner
    try {
      const res = await fetch(
        "https://delala-e-commerce-backend.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false); // hide spinner
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
      }}
    >
      {/* Spinner Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              border: "6px solid #f3f3f3",
              borderTop: "6px solid #007bff",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`@keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }`}
          </style>
        </div>
      )}

      {/* Registration Form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}>
          Create Your Account
        </h2>

        {/* Username */}
        <label style={{ marginBottom: "0.3rem", fontWeight: "500" }}>
          Username
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          style={{
            padding: "10px",
            border: errors.username ? "1px solid red" : "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "0.5rem",
          }}
        />
        {errors.username && (
          <small style={{ color: "red", marginBottom: "0.5rem" }}>
            {errors.username}
          </small>
        )}

        {/* Email */}
        <label style={{ marginBottom: "0.3rem", fontWeight: "500" }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          style={{
            padding: "10px",
            border: errors.email ? "1px solid red" : "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "0.5rem",
          }}
        />
        {errors.email && (
          <small style={{ color: "red", marginBottom: "0.5rem" }}>
            {errors.email}
          </small>
        )}

        {/* Password */}
        <label style={{ marginBottom: "0.3rem", fontWeight: "500" }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          style={{
            padding: "10px",
            border: errors.password ? "1px solid red" : "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "0.5rem",
          }}
        />
        {errors.password && (
          <small style={{ color: "red", marginBottom: "0.5rem" }}>
            {errors.password}
          </small>
        )}

        {/* Role */}
        <label style={{ marginBottom: "0.3rem", fontWeight: "500" }}>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        {/* Button */}
        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0056b3")}
          onMouseOut={(e) => (e.target.style.background = "#007bff")}
        >
          Register
        </button>

        <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
