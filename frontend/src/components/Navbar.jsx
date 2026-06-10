import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Hide navbar on login and register pages
  if (location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className="navbar">
      <h1 className="logo">🌿 FloraConnect</h1>

      <nav>
        {user?.role === "ADMIN" && (
          <>
            <Link to="/admin/home">Home</Link>
            <Link to="/admin/addproduct">Add Product</Link>
            <Link to="/admin/adminproduct">Admin Product</Link>
            <Link to="/admin/admindashboard">Dashboard</Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {user?.role === "CLIENT" && (
          <>
            <Link to="/home">Home</Link>
            <Link to="/plants">Plants</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/scan">Plant Scanner</Link>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}