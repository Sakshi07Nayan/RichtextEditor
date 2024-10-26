import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4">
      <div className="container">
        <div className="row text-center text-md-left">
          <div className="col-md-4 mb-4">
            <h5>Shop</h5>
            <ul className="list-unstyled">
              <li><Link to="/products" className="text-white">All Products</Link></li>
              <li><Link to="/categories" className="text-white">Categories</Link></li>
              <li><Link to="/sales" className="text-white">Sales</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>Customer Service</h5>
            <ul className="list-unstyled">
              <li><Link to="/contact" className="text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-white">FAQ</Link></li>
              <li><Link to="/shipping" className="text-white">Shipping & Returns</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h5>About Us</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-white">Our Story</Link></li>
              <li><Link to="/blog" className="text-white">Blog</Link></li>
              <li><Link to="/careers" className="text-white">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom text-center py-3">
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
          <ul className="list-inline">
            <li className="list-inline-item"><Link to="/privacy" className="text-white">Privacy Policy</Link></li>
            <li className="list-inline-item"><Link to="/terms" className="text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
