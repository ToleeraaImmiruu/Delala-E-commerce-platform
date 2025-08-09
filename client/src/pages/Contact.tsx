import React, { useState } from "react";
import '../Styling/Contact.css';
function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent! ✅");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p className="contact-subtitle">
        Have a question or need help? We’re here to assist you.
      </p>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"   rows="5"
          
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Contact Details */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>📍 Addis Ababa, Ethiopia</p>
          <p>📧 support@yourwebsite.com</p>
          <p>📞 +251 900 000 000</p>

          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127585.30748029028!2d38.693359!3d9.005401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85d5b8b8a4a7%3A0x8f69c8c86b8f78a5!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1681234567890"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
