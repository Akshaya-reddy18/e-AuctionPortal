import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('auctionUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    // when user becomes available, fetch notifications and alert unread
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await api.get('/notifications');
        const notifs = res.data || [];
        for (const n of notifs) {
          if (!n.read) {
            // simple alert for the user
            try {
              window.alert(n.message);
              await api.post(`/notifications/${n._id}/read`);
            } catch (e) {
              // ignore errors
            }
          }
        }
      } catch (err) {
        // ignore
      }
    };

    fetchNotifications();
  }, [user]);

  const login = (data) => {
    const nextUser = {
      token: data.token,
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };
    localStorage.setItem('auctionUser', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('auctionUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
