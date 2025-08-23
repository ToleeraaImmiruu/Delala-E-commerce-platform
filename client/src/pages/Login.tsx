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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setBackendError(""); // Clear backend error on input
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

      // Save token & user info locally
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update app state
      setToken(data.token);
      setUser(data.user);

      // Redirect based on role
      if (data.user.role === "admin") navigate("/admin-dashboard");
      else if (data.user.role === "seller") navigate("/seller-dashboard");
      else navigate("/buyer-dashboard");
    } catch (err: any) {
      setBackendError(err.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>Login to Your Account</h2>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          required
        />
        {errors.email && <small className="error-msg">{errors.email}</small>}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
          required
        />
        {errors.password && <small className="error-msg">{errors.password}</small>}

        <button type="submit" className="login-btn">Login</button>

        {/* Backend error */}
        {backendError && <p className="backend-error-msg">{backendError}</p>}

        <p className="register-redirect">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
