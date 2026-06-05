import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (!userId) {
      console.error("User ID not found");
      return;
    }

    try {
      const res = await fetch(
        `https://plant-management-app-0jp3.onrender.com/api/cart/${userId}`
      );

      const data = await res.json();

      const cartItems = Array.isArray(data) ? data : [];

      setCart(cartItems);
      calculateTotal(cartItems);
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  const calculateTotal = (items) => {
    let sum = 0;

    items.forEach((item) => {
      sum += Number(item.price) * Number(item.quantity);
    });

    setTotal(sum);
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;

    try {
      await fetch(
        `https://plant-management-app-0jp3.onrender.com/api/cart/update/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: newQty,
          }),
        }
      );

      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await fetch(
        `https://plant-management-app-0jp3.onrender.com/api/cart/remove/${itemId}`,
        {
          method: "DELETE",
        }
      );

      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOrderNow = async () => {
    if (cart.length === 0) return;

    const orderData = {
      userId,
      items: cart.map((item) => ({
        plantId: item.plantId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: total,
    };

    try {
      const res = await fetch(
        "https://plant-management-app-0jp3.onrender.com/api/orders/place",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      alert("🎉 Order placed successfully!");

      await fetch(
        `https://plant-management-app-0jp3.onrender.com/api/cart/clear/${userId}`,
        {
          method: "DELETE",
        }
      );

      navigate("/orders");
    } catch (err) {
      alert("Order failed: " + err.message);
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>

      <div className="cart-flex">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-card" key={item.id}>
                {item.imageUrl && (
                  <img
                    src={`https://plant-management-app-0jp3.onrender.com${item.imageUrl}`}
                    alt={item.plantName}
                  />
                )}

                <div className="cart-info">
                  <h3>{item.plantName}</h3>
                  <p className="price">₹{item.price}</p>

                  <div className="qty-box">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p className="summary-total">Total: ₹{total}</p>

          <button
            className="order-now-btn"
            onClick={handleOrderNow}
            disabled={cart.length === 0}
          >
            ⚡ Order Now
          </button>
        </div>
      </div>
    </div>
  );
}