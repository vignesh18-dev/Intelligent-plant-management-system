import React, { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch(
        "https://plant-management-app-0jp3.onrender.com/api/orders/admin/all"
      );

      const data = await res.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  return (
    <div className="orders-container">
      <h2>📦 All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            <h3>Order #{order.id}</h3>

            <p>User ID: {order.userId}</p>

            <p>Total Amount: ₹{order.totalPrice}</p>

            <p>Status: {order.status}</p>

            <h4>Items:</h4>

            <ul>
              {order.items?.map((item, index) => (
                <li key={index}>
                  Plant #{item.plantId} | Qty: {item.quantity} | ₹{item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}