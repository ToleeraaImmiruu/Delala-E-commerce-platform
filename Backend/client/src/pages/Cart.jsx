import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false); // new state

  const token = localStorage.getItem("token");

  // Fetch user cart
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/getCar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Remove item from cart
  const removeItem = async (carId) => {
    try {
      await axios.delete(`http://localhost:5000/api/remove/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({
        ...cart,
        items: cart.items.filter((item) => item.car._id !== carId),
        total: cart.items
          .filter((item) => item.car._id !== carId)
          .reduce((acc, i) => acc + i.price * i.quantity, 0),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Update quantity
  const updateQuantity = async (carId, newQty) => {
    if (newQty < 1) return;
    const updatedItems = cart.items.map((item) =>
      item.car._id === carId ? { ...item, quantity: newQty } : item
    );
    const newTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setCart({ ...cart, items: updatedItems, total: newTotal });
  };

  // New: Place order for all items in cart
  const handlePlaceOrder = async () => {
    if (!token) return alert("Please login to place an order!");
    if (!cart || cart.items.length === 0) return alert("Cart is empty!");
    setPlacingOrder(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders/place",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.order) {
        alert("Order placed successfully!");
        setCart({ ...cart, items: [], total: 0 }); // clear cart
      } else {
        alert(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
    setPlacingOrder(false);
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (!cart || cart.items.length === 0)
    return <p className="text-center mt-10">Your cart is empty.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      <div className="bg-white shadow rounded-lg p-4">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.car.images[0]}
                alt={item.car.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h3 className="text-lg font-semibold">{item.car.name}</h3>
                <p className="text-gray-600">Price: {item.price} ETB</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.car._id, item.quantity - 1)}
                className="bg-gray-200 px-2 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.car._id, item.quantity + 1)}
                className="bg-gray-200 px-2 rounded"
              >
                +
              </button>
            </div>

            <div>
              <p className="font-semibold">
                Total: {item.price * item.quantity} ETB
              </p>
              <button
                onClick={() => removeItem(item.car._id)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="text-right mt-6">
          <p className="text-2xl font-bold">Grand Total: {cart.total} ETB</p>
          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="mt-3 bg-green-500 text-white px-6 py-2 rounded"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
