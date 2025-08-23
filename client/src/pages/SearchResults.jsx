/* global process */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL; // production-ready backend URL

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) fetchSearchResults(query);
  }, [query]);

  const fetchSearchResults = async (q) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/search?q=${q}`);
      const data = await res.json();
      setProducts(data.products || []); // ensure consistent structure
    } catch (err) {
      console.error("Search fetch error:", err);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading search results...</p>;
  if (!products || products.length === 0)
    return <p>No results found for "{query}"</p>;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        style={{
          margin: "10px 0",
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ⬅ Back
      </button>

      <h2 className="mb-4">Search results for "{query}"</h2>
      <div className="ImageGallery22 relative top-15 flex flex-wrap gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="CarCard2 relative left-0 flex flex-col items-center p-2 border rounded"
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{ width: "250px", borderRadius: "6px" }}
              />
            )}
            <h3 className="mt-2">{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Location: {product.location}</p>
            <p>Type: {product.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
