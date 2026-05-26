import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidValues, setBidValues] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Could not load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleBidChange = (productId, value) => {
    setBidValues({ ...bidValues, [productId]: value });
  };

  const placeBid = async (productId) => {
    setMessage('');
    setError('');
    try {
      await api.post(`/bids/${productId}`, { amount: bidValues[productId] });
      setMessage('Bid placed successfully');
      setBidValues({ ...bidValues, [productId]: '' });
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  return (
    <div className="page-section">
      <section className="section-head">
        <h2>Buyer Dashboard</h2>
        <p>Browse auctions, place bids, and open any product for full history.</p>
      </section>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <div className="loading-state">Loading auctions...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products available.</div>
      ) : (
        <div className="grid grid-3">
          {products.map((product) => {
            const isEnded = new Date(product.auctionEndTime).getTime() <= new Date().getTime();
            return (
              <div key={product._id}>
                <ProductCard product={product} />
                <div className="buyer-card-footer">
                  <input
                    type="number"
                    min="0"
                    placeholder="Your bid"
                    value={bidValues[product._id] || ''}
                    onChange={(event) => handleBidChange(product._id, event.target.value)}
                    disabled={isEnded}
                  />
                  <button className="btn btn-primary" onClick={() => placeBid(product._id)} disabled={isEnded}>
                    Place Bid
                  </button>
                  <span className="muted-text">Highest: ₹{product.currentHighestBid}</span>
                  <Link className="btn btn-outline" to={`/product/${product._id}`}>
                    History
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
