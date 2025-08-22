import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(null); // track which item is being ordered

  const token = localStorage.getItem("token");

  // Fetch user cart
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/getcar", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data || { items: [], total: 0 });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch cart");
    }
    setLoading(false);
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
      const updatedItems = cart.items.filter((item) => item.car._id !== carId);
      setCart({
        items: updatedItems,
        total: updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  // Update quantity
  const updateQuantity = async (carId, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/api/updateQuantity/${carId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedItems = cart.items.map((item) =>
        item.car._id === carId ? { ...item, quantity: newQty } : item
      );
      setCart({
        items: updatedItems,
        total: updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity");
    }
  };

  // Place order for individual car
  const handlePlaceOrder = async (carId, quantity, price) => {
    setPlacingOrder(carId);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/place/${carId}`,
        { quantity, price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.order) {
        alert("Order placed successfully!");
        const updatedItems = cart.items.filter((item) => item.car._id !== carId);
        setCart({
          items: updatedItems,
          total: updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
        });
      } else {
        alert(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
    setPlacingOrder(null);
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
            key={item.car._id}
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
                <p className="text-gray-600">
                  Price: {item.price} ETB × {item.quantity}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() =>
                    updateQuantity(item.car._id, item.quantity - 1)
                  }
                  className="bg-gray-200 px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.car._id, item.quantity + 1)
                  }
                  className="bg-gray-200 px-2 rounded"
                >
                  +
                </button>
              </div>

              <p className="font-semibold">
                Total: {item.price * item.quantity} ETB
              </p>

              {/* Place Order button per item */}
              <button
                onClick={() =>
                  handlePlaceOrder(item.car._id, item.quantity, item.price)
                }
                disabled={placingOrder === item.car._id}
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                {placingOrder === item.car._id ? "Placing..." : "Place Order"}
              </button>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.car._id)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-1"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="text-right mt-6">
          <p className="text-2xl font-bold">Grand Total: {cart.total} ETB</p>
        </div>
      </div>


    </div>
  );
};

/* 🔽 Extra components for MyOrders & UpdateStatus 🔽 */



export default Cart;
