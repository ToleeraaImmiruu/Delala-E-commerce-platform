import React, { useEffect, useState } from "react";
import "../Styling/BuyerDashboard.css";// external CSS

const PublicProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/public") // change to your backend URL
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="ImageGallery2">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product) => (
          <div key={product._id} className="CarCard2">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="GalleryImage2"
              />
            )}
            <div className="CarDetails2">
              <h3>{product.name}</h3>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Location:</strong> {product.location}
              </p>
              <p>
                <strong>Type:</strong> {product.type}
              </p>
              <button className="btn">View Details</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PublicProducts;
