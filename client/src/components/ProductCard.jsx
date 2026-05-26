import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import api from '../services/api';

function isAuctionEnded(endTime) {
  return new Date(endTime).getTime() <= new Date().getTime();
}

export default function ProductCard({ product, children }) {
  const ended = isAuctionEnded(product.auctionEndTime);

  const finalize = async () => {
    try {
      await api.post(`/products/${product._id}/finalize`);
    } catch (err) {
      // ignore
    }
  };

  return (
    <article className="product-card">
      <img className="product-image" src={product.imageUrl} alt={product.title} />
      <div className="product-content">
        <div className="product-top-row">
          <h3>{product.title}</h3>
          <span className={`status-pill ${ended ? 'ended' : 'live'}`}>{ended ? 'Ended' : 'Live'}</span>
        </div>
        <p className="muted-text">{product.description}</p>
        <div className="product-meta">
          <span>Starting bid: ₹{product.startingBid}</span>
          <span>Highest bid: ₹{product.currentHighestBid}</span>
        </div>
        <div className="product-meta">
          <CountdownTimer endTime={product.auctionEndTime} onEnd={finalize} />
        </div>
        <div className="product-actions">
          <Link to={`/product/${product._id}`} className="btn btn-secondary">
            View Details
          </Link>
          {children}
        </div>
      </div>
    </article>
  );
}
