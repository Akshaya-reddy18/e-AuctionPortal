import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="page-section">
      <section className="hero-card">
        <div>
          <p className="eyebrow">e-Auction</p>
          <h1>Simple Online Auction Platform</h1>
          <p className="hero-copy">
            Sellers can list auction items, buyers can bid, and everyone can track the timer and bid history.
          </p>
          <div className="hero-actions">
            {user?.role === 'seller' && <Link to="/seller-dashboard" className="btn btn-primary">Seller Dashboard</Link>}
            {user?.role === 'buyer' && <Link to="/buyer-dashboard" className="btn btn-primary">Buyer Dashboard</Link>}
            {!user && <Link to="/register" className="btn btn-primary">Create Account</Link>}
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        </div>
        <div className="hero-stat-box">
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Live auction items</span>
        </div>
      </section>

      <section className="section-head">
        <h2>Current Auctions</h2>
        <p>Browse the latest items listed by sellers.</p>
      </section>

      {loading ? (
        <div className="loading-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products have been added yet.</div>
      ) : (
        <div className="grid grid-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
