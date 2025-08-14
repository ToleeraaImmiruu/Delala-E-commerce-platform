import { useEffect, useState } from "react";

export default function AdminPendingList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending-products?status=pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching pending products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await fetch(`/api/admin/pending-products/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ adminNotes: "Approved" })
    });
    load();
  };

  const reject = async (id) => {
    await fetch(`/api/admin/pending-products/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ adminNotes: "Rejected: Low quality photos" })
    });
    load();
  };

  if (loading) return <p className="text-center mt-4">Loading pending products...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Pending Listings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Images</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._id} className="text-center">
                <td className="py-2 px-4 border">{it.name}</td>
                <td className="py-2 px-4 border">${it.price}</td>
                <td className="py-2 px-4 border">{it.location}</td>
                <td className="py-2 px-4 border">{it.type}</td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2 justify-center flex-wrap">
                    {it.images.map((img, i) => (
                      <img key={i} src={img.url} alt="" className="w-20 h-16 object-cover rounded" />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 border">
                  <span className="px-2 py-1 rounded-full bg-yellow-200 text-yellow-800 font-semibold">
                    Pending
                  </span>
                </td>
                <td className="py-2 px-4 border flex justify-center gap-2">
                  <button
                    onClick={() => approve(it._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => reject(it._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No pending products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
