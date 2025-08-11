import React from 'react';
import '../Styling/Services.css';
const Data = [
  {
    id: 1,
    title: 'Buy & Sell Cars',
    icon: '🚗',
    desc: 'Easily list your car for sale or find your dream ride from verified sellers.',
  },
  {
    id: 2,
    title: 'Advanced Search Filters',
    icon: '🔍',
    desc: 'Find exactly what you need by model, price, location, or property type.',
  },
  {
    id: 3,
    title: 'High-Quality Listings',
    icon: '📷',
    desc: 'Upload clear images and videos to attract more buyers.',
  },
  {
    id: 4,
    title: 'Secure Transactions',
    icon: '📊',
    desc: 'We ensure safe and verified payment processes for your peace of mind.',
  },
];

function Services() {
  return (
    <div  id='service' className="ServicesSection">
      <h1>Our Services</h1>
      <div className="ServicesGrid">
        {Data.map((item) => (
          <div key={item.id} className="ServiceCard">
            <span className="ServiceIcon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
