import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/myOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> {order.total} ETB</p>
              <ul className="ml-4 list-disc">
                {order.items.map((i) => (
  <li key={i._id}>{i.car?.name} (x{i.quantity})</li>
))}

              </ul>

              {/* Update status (admin only) */}
              <UpdateOrderStatus orderId={order._id} currentStatus={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const UpdateOrderStatus = ({ orderId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const token = localStorage.getItem("token");

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/updateStatus/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Status updated!");
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Update
      </button>
    </div>
  );
};


export default MyOrders;
