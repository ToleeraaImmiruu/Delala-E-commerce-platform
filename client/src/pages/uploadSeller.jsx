import { useState } from "react";

export default function SellerUploadForm() {
  const [form, setForm] = useState({ name: "", price: "", location: "", type: "" });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); // "success" or "error"

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setStatus("");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("location", form.location);
    fd.append("type", form.type);
    for (const file of files) fd.append("products", file);

    try {
     const res = await fetch("http://localhost:5000/api/pending-products", {
  method: "POST",
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  body: fd
});

let data;
try {
  data = await res.json();
} catch {
  setMsg("❌ Server returned invalid response");
  setStatus("error");
  return;
}

if (data.success) {
  setMsg("✅ Submitted successfully. Waiting for admin approval.");
  setStatus("success");
} else {
  setMsg(`❌ ${data.message || "Submission failed"}`);
  setStatus("error");
}

    } catch (error) {
      setMsg(`❌ Server error: ${error.message}`);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Upload Your Car</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
        />
        <input
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />
        <input
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        />
        <input
          type="file" name="products"
          multiple
          accept="image/*"
          onChange={e => setFiles([...e.target.files])}
          className="w-full text-gray-700"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Submit for review
        </button>
      </form>

      {msg && (
        <p
          className={`mt-4 text-center font-medium ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </p>
      )}
    </div>
  );
}
