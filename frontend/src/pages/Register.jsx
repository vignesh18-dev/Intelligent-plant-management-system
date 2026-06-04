import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reqBody = {
      username: form.username,
      email: form.email,
      password: form.password,
      role: "CLIENT", // default for signup
    };

    try {
      const response = await fetch("https://plant-management-app-0jp3.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });

      const result = await response.text();
      setMessage(result);

      if (response.ok) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      setMessage("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {message && <p className="auth-message">{message}</p>}

        <input
          type="text"
          name="username"
          placeholder="Full Name"
          required
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
        />

        <button className="btn">Register</button>

        <p className="auth-switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
