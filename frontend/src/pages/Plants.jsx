import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);

    fetch("https://plant-management-app-0jp3.onrender.com/api/plants")
      .then((res) => res.json())
      .then((data) => {
        setPlants(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading plants:", err);
        setLoading(false);
      });
  }, []);

  // 🛒 Add to Cart using backend API
  const handleAddToCart = async (plant) => {
    if (!userId) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId: plant.id,
          plantName: plant.name,
          price: plant.price,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item to cart");
      alert(`${plant.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Something went wrong!");
    }
  };

  // ⚡ Order Now — adds item to cart & redirects to cart page
  const handleOrderNow = async (plant) => {
    if (!userId) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId: plant.id,
          plantName: plant.name,
          price: plant.price,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to process order");
      navigate("/cart");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <h2 className="loading">Loading plants...</h2>;

  return (
    <div className="plants-container">
      <h2 className="plants-title">🌿 Available Plants</h2>

      <div className="plants-grid">
        {plants.map((p) => (
          <div className="plant-card" key={p.id}>
            <img
              src={`http://localhost:8080${p.imageUrl}`}
              alt={p.name}
              className="plant-img"
            />

            <h3>{p.name}</h3>
            <p className="price">₹{p.price}</p>
            <p className="desc">{p.description}</p>

            <button className="cart-btn" onClick={() => handleAddToCart(p)}>
              🛒 Add to Cart
            </button>

            <button className="order-btn" onClick={() => handleOrderNow(p)}>
              ⚡ Order Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
