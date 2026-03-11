import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, ArrowRight, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Bookmarks = () => {
  const { user } = useContext(AuthContext);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedBlogs = async () => {
      try {
        const res = await axios.get('/api/users/profile');
        setSavedBlogs(res.data.savedBlogs || []);
      } catch (err) {
        console.error("Failed to load saved blogs", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchSavedBlogs();
  }, [user]);

  // Utility to stringify rich text
  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Please log in to view your bookmarks.</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>Sign In</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '50px 0', marginBottom: '40px' }}>
         <div className="container">
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '10px' }}>Your Bookmarks</h1>
            <p style={{ color: 'var(--text-muted)' }}>Stories you've saved for later reading.</p>
         </div>
      </div>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>Loading bookmarks...</div>
        ) : savedBlogs.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>No saved stories</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '30px' }}>Your reading list is currently empty.</p>
            <Link to="/" className="btn btn-primary" style={{ padding: '14px 30px' }}>Explore Articles</Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px' }}>
            {savedBlogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card card-hover"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                     </div>
                     <div>
                       <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{blog.author?.name || 'Unknown Author'}</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <span>{new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                       </div>
                     </div>
                  </div>
                  
                  <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', lineHeight: '1.3', fontWeight: '800' }}>
                    <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                  </h2>
                  
                  <p style={{ color: 'var(--text-light)', lineHeight: '1.6', fontSize: '1.05rem', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                    {blog.plainTextSummary || stripHtml(blog.content)}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                         <Heart size={18} /> {blog.likes?.length || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                         <BookOpen size={18} /> {blog.views || 0} views
                      </span>
                    </div>
                    
                    <Link to={`/blog/${blog._id}`} style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', fontSize: '0.95rem' }}>
                      Read <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
