/* global process */
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // use deployed backend

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/myOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        alert("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
        `${API_URL}/api/updateStatus/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Status updated!");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Shipped">Shipped</option>
        <option value="Cancelled">Cancelled</option>
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
