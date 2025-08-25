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

  const [loading, setLoading] = useState(false); // spinner state

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const newErrors = {} ;

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
    console.log("Sending to backend:", formData);

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
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2>Create Your Account</h2>

        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          className={errors.username ? "input-error" : ""}
          required
        />
        {errors.username && <small className="error-msg">{errors.username}</small>}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email"
          className={errors.email ? "input-error" : ""}
          required
        />
        {errors.email && <small className="error-msg">{errors.email}</small>}

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          className={errors.password ? "input-error" : ""}
          required
        />
        {errors.password && <small className="error-msg">{errors.password}</small>}

        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit" className="register-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Spinner */}
        {loading && (
          <div
            style={{
              margin: "20px auto",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              animation: "spin 1s linear infinite",
            }}
          />
        )}

        <p className="login-redirect">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login here
          </Link>
        </p>
      </form>

      {/* Inline animation */}
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
