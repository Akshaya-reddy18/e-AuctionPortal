import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Auction<span>Hub</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          {user?.role === 'seller' && (
            <NavLink to="/seller-dashboard" className="nav-link">
              Seller Dashboard
            </NavLink>
          )}
          {user?.role === 'buyer' && (
            <NavLink to="/buyer-dashboard" className="nav-link">
              Buyer Dashboard
            </NavLink>
          )}
          {!user && (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">{user.name}</span>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="btn btn-primary" to="/register">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
