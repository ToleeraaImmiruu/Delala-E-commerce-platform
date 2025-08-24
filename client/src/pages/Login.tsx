import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styling/Login.css";
interface LoginForm {
  email: string;
  password: string;
}

interface LoginPageProps {
  setUser: (user: any) => void;
  setToken: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setUser, setToken }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [backendError, setBackendError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // 👈 added

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setBackendError(""); 
  };

  const validate = () => {
    const newErrors: Partial<LoginForm> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); // 👈 start loading
    try {
      const res = await fetch("https://delala-e-commerce-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setBackendError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      if (data.user.role === "admin") navigate("/admin-dashboard");
      else if (data.user.role === "seller") navigate("/seller-dashboard");
      else navigate("/buyer-dashboard");
    } catch (err: any) {
      setBackendError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false); // 👈 stop loading
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          width: "350px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login to Your Account</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        {errors.email && <small style={{ color: "red" }}>{errors.email}</small>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        {errors.password && <small style={{ color: "red" }}>{errors.password}</small>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#aaa" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {backendError && <p style={{ color: "red", marginTop: "10px" }}>{backendError}</p>}
        {loading && <p style={{ color: "#555", textAlign: "center", marginTop: "10px" }}>Please wait...</p>}

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
