import { useState } from "react";

export default function SellerUploadForm() {
  const [form, setForm] = useState({
    name: "",
    year: "",
    km_driven: "",
    fuel: "",
    owner: "",
    seats: "",
  });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); // "success" or "error"

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setStatus("");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("year", form.year);
    fd.append("km_driven", form.km_driven);
    fd.append("fuel", form.fuel);
    fd.append("owner", form.owner);
    fd.append("seats", form.seats);
    files.forEach(file => fd.append("products", file));

    try {
      const res = await fetch("https://delala-e-commerce-backend.onrender.com/api/pending-products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
        setForm({
          name: "",
          year: "",
          km_driven: "",
          fuel: "",
          owner: "",
          seats: "",
        });
        setFiles([]);
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
          placeholder="Car Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={e => setForm({ ...form, year: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="KM Driven"
          value={form.km_driven}
          onChange={e => setForm({ ...form, km_driven: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Fuel Type (Petrol/Diesel/etc.)"
          value={form.fuel}
          onChange={e => setForm({ ...form, fuel: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Owner (First Owner/Second Owner/etc.)"
          value={form.owner}
          onChange={e => setForm({ ...form, owner: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Seats"
          value={form.seats}
          onChange={e => setForm({ ...form, seats: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="file"
          name="products"
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
