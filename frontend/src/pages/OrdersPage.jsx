import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.userId) return;

      const res = await fetch(
        `https://plant-management-app-0jp3.onrender.com/api/orders/user/${user.userId}`
      );

      const data = await res.json();

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Order #{order.id}</h3>

              <p>👤 User ID: {order.userId}</p>

              <p>💰 Total Amount: ₹{order.totalPrice}</p>

              <p>📌 Status: {order.status}</p>

              <h4>Items:</h4>

              <ul>
                {order.items?.map((item, idx) => (
                  <li key={idx}>
                    🌿 Plant #{item.plantId}
                    {" - "}
                    Qty: {item.quantity}
                    {" - "}
                    ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}