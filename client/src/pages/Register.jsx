import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styling/Register.css";
const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer", // default role
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false); // loading state

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // start spinner

    try {
      const res = await fetch("https://delala-e-commerce-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response from backend:", data);

      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false); // stop spinner
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      {loading ? (
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
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
            width: "300px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Create Your Account</h2>

          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0 10px",
              border: errors.username ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
          {errors.username && <small style={{ color: "red" }}>{errors.username}</small>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0 10px",
              border: errors.email ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
          {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0 10px",
              border: errors.password ? "1px solid red" : "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          />
          {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px",
              margin: "5px 0 15px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            required
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Register
          </button>

          <p style={{ textAlign: "center", marginTop: "10px" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#3498db", textDecoration: "none" }}>
              Login here
            </Link>
          </p>
        </form>
      )}

      {/* Inline keyframes for spinner */}
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
};

export default RegisterPage;
