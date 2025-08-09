import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styling/Login.css";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  // Simple validation
  const validate = () => {
    const newErrors: Partial<LoginForm> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // TODO: Replace this with your auth API call
    alert(`Logged in successfully as ${formData.email}`);

    // Navigate to dashboard or home after login
    navigate("/dashboard");
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
        {errors.password && (
          <small className="error-msg">{errors.password}</small>
        )}

        <button type="submit" className="login-btn">
          Login
        </button>

        <p className="register-redirect">
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
