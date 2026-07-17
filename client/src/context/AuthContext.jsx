import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check persistent login on app load

  // On app load, ask the backend "who am I?" using the httpOnly cookie.
  // This is what makes login persist across refreshes without touching localStorage.
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    setUser(data.user);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  // Lets Profile-edit page (later) update user data in context without a full re-fetch
  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateUser, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — components use `useAuth()` instead of importing useContext + AuthContext every time
export const useAuth = () => useContext(AuthContext);