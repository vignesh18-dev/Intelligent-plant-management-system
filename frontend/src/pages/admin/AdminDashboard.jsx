import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const [plantsCount, setPlantsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [latestOrders, setLatestOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadCounts();
    loadLatestOrders();
  }, []);

  const loadCounts = async () => {
    try {
      const plantsRes = await api.get("/api/plants");
      setPlantsCount(plantsRes.data.length);

      const ordersRes = await api.get("/api/orders/admin/all");
      setOrdersCount(ordersRes.data.length);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const loadLatestOrders = async () => {
    try {
      const res = await api.get("/api/orders/admin/all");
      const data = res.data;

      setLatestOrders(Array.isArray(data) ? data.slice(-5).reverse() : []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">📊 Admin Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dash-card plants">
          <h3>{plantsCount}</h3>
          <p>Total Plants</p>
        </div>

        <div className="dash-card orders">
          <h3>{ordersCount}</h3>
          <p>Total Orders</p>
        </div>
      </div>

      <div className="latest-orders">
        <h3>🧾 Latest Orders</h3>

        {latestOrders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User ID</th>
                <th>Total Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-actions">
        <button
          className="dash-btn"
          onClick={() => navigate("/admin/adminproduct")}
        >
          🌱 Manage Products
        </button>

        <button
          className="dash-btn"
          onClick={() => navigate("/admin/orders")}
        >
          📦 View All Orders
        </button>
      </div>
    </div>
  );
}