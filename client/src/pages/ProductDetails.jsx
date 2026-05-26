import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      setBids(response.data.bids);
    } catch (err) {
      setError('Could not load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const placeBid = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post(`/bids/${id}`, { amount: bidAmount });
      setMessage('Bid placed successfully');
      setBidAmount('');
      loadDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const ended = product ? new Date(product.auctionEndTime).getTime() <= new Date().getTime() : true;

  if (loading) {
    return <div className="loading-state">Loading product...</div>;
  }

  if (!product) {
    return <div className="empty-state">Product not found.</div>;
  }

  return (
    <div className="page-section details-layout">
      <section className="detail-card">
        <img className="detail-image" src={product.imageUrl} alt={product.title} />
        <div className="detail-content">
          <div className="product-top-row">
            <h2>{product.title}</h2>
            <span className={`status-pill ${ended ? 'ended' : 'live'}`}>{ended ? 'Auction Ended' : 'Live'}</span>
          </div>
          <p>{product.description}</p>
          <div className="detail-grid">
            <div>
              <strong>Seller</strong>
              <p>{product.sellerName}</p>
            </div>
            <div>
              <strong>Starting Bid</strong>
              <p>₹{product.startingBid}</p>
            </div>
            <div>
              <strong>Highest Bid</strong>
              <p>₹{product.currentHighestBid}</p>
            </div>
            <div>
              <strong>Countdown</strong>
              <p><CountdownTimer endTime={product.auctionEndTime} /></p>
            </div>
          </div>

          {user?.role === 'buyer' && !ended ? (
            <form className="bid-form" onSubmit={placeBid}>
              <input
                type="number"
                min="0"
                placeholder="Place your bid"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit">
                Submit Bid
              </button>
            </form>
          ) : (
            <div className="empty-note">Login as a buyer to place a bid.</div>
          )}

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      </section>

      <section className="panel-card">
        <h3>Bid History</h3>
        {bids.length === 0 ? (
          <div className="empty-state">No bids yet.</div>
        ) : (
          <div className="history-list">
            {bids.map((bid) => (
              <div key={bid._id} className="history-item">
                <div>
                  <strong>{bid.bidderName}</strong>
                  <p>{new Date(bid.createdAt).toLocaleString()}</p>
                </div>
                <span>₹{bid.amount}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
