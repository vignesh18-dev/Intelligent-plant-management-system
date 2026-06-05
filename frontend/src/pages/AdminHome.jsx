import React from "react";

export default function AdminHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="admin-home">
      <div className="admin-card">
        <h1>🌱 Admin Dashboard</h1>

        <h2>Welcome, {user?.username || "Admin"} 👋</h2>

        <p className="admin-subtext">
          Manage products, view orders, and control the entire plant marketplace system.
        </p>

        <div className="admin-actions">
          <a href="/admin/addproduct" className="admin-btn">
            ➕ Add Product
          </a>

          <a href="/admin/adminproduct" className="admin-btn">
            🌿 Manage Products
          </a>

          <a href="/admin/admindashboard" className="admin-btn">
            📊 View Dashboard
          </a>

          <a href="/admin/orders" className="admin-btn">
            📦 View Orders
          </a>
        </div>
      </div>
    </div>
  );
}