import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('blogUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAuthToken(parsedUser.token);
      
      // Optionally fetch fresh profile data to keep savedBlogs synced
      fetchFreshProfile(parsedUser.token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFreshProfile = async (token) => {
    try {
      const res = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(prev => ({ ...prev, savedBlogs: res.data.savedBlogs }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      localStorage.setItem('blogUser', JSON.stringify(res.data));
      setAuthToken(res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const loginUser = async (userData) => {
    try {
      const res = await axios.post('/api/auth/login', userData);
      localStorage.setItem('blogUser', JSON.stringify(res.data));
      setAuthToken(res.data.token);
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('blogUser');
    setAuthToken(null);
    setUser(null);
  };

  const saveBlog = async (id) => {
    try {
      const res = await axios.put(`/api/users/save-blog/${id}`);
      setUser(prev => {
        // Update user state and local storage with new savedBlogs array
        const updatedUser = { ...prev, savedBlogs: res.data };
        localStorage.setItem('blogUser', JSON.stringify(updatedUser));
        return updatedUser;
      });
      return res.data;
    } catch (error) {
       console.error("Error saving blog", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, logoutUser, saveBlog }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
