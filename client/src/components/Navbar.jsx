import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, PenTool, Sun, Moon } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? { color: 'var(--secondary)', fontWeight: 'bold' } : {};
  };

  return (
    <nav style={{ 
      background: 'var(--bg-card)', 
      padding: '15px 40px', 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <Link to="/" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.5px' }}>
        Tech <span style={{ color: 'var(--primary)' }}>Blogger</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <Link to="/" style={{ ...isActive('/'), fontWeight: '500' }}>Home</Link>
        
        <div style={{ width: '1px', height: '20px', background: 'var(--border)' }}></div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link to="/write" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px' }}>
              <PenTool size={18} /> Write
            </Link>
            
            <Link to="/bookmarks" style={{ ...isActive('/bookmarks'), display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', color: 'var(--text-main)', transition: 'color 0.2s' }}>
              <User size={18} /> Bookmarks
            </Link>
            
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', border: '1px solid var(--border)', color: 'var(--danger)', borderRadius: '8px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to="/login" style={{ padding: '10px 16px', color: 'var(--text-main)', fontWeight: 'bold' }}>Log In</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px' }}>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
