import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const initialForm = {
  title: '',
  description: '',
  imageUrl: '',
  startingBid: '',
  auctionEndTime: '',
};

export default function SellerDashboard() {
  const [form, setForm] = useState(initialForm);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/mine');
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);

    try {
      await api.post('/products', form);
      setMessage('Product added successfully');
      setForm(initialForm);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm('Delete this product?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${productId}`);
      setProducts((current) => current.filter((product) => product._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="page-section">
      <section className="section-head">
        <h2>Seller Dashboard</h2>
        <p>Add products and track your auctions.</p>
      </section>

      <section className="panel-card form-panel">
        <h3>Add Auction Product</h3>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Product title" required />
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" required />
          <input
            name="startingBid"
            type="number"
            min="0"
            value={form.startingBid}
            onChange={handleChange}
            placeholder="Starting bid"
            required
          />
          <input
            name="auctionEndTime"
            type="datetime-local"
            value={form.auctionEndTime}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Add Product'}
          </button>
        </form>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="section-head">
        <h2>Your Products</h2>
        <p>See the highest bid and remove items if needed.</p>
      </section>

      {loading ? (
        <div className="loading-state">Loading your products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">You have not added any products yet.</div>
      ) : (
        <div className="grid grid-2">
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
                <div className="seller-card-footer">
                <span>Highest bid: ₹{product.currentHighestBid}</span>
                <button className="btn btn-danger" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
