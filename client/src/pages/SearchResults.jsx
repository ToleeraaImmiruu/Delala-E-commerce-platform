import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ add this

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse query from URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (query) fetchSearchResults(query);
  }, [query]);

  const fetchSearchResults = async (q) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/search?q=${q}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Search fetch error:", err);
    }
    setLoading(false);
  };

  if (loading) return <p>Loading search results...</p>;
  if (!products || products.length === 0) return <p>No results found for "{query}"</p>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)} // ✅ now works
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

      <h2>Search results for "{query}"</h2>
      <div className="ImageGallery22 relative top-15 ">
        {products.map((product) => (
          <div key={product._id} className="CarCard2 relative left-10">
          
           
            {product.images && product.images.length > 0 && (
              <img src={product.images[0]} alt={product.name} style={{ width: "250px " }} />
            )}
              <h3>{product.name}</h3>
             <p >Price: ${product.price}</p>
            <p>Location: {product.location}</p>
            <p>Type: {product.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
