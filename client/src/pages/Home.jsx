import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, TrendingUp, Tag as TagIcon, Search, Heart, BookOpen, Compass, Home as HomeIcon, Bookmark, Terminal, Zap, Star, Trash2 } from 'lucide-react';
import BlogContext from '../context/BlogContext';
import AuthContext from '../context/AuthContext';

const CATEGORIES = [
  'All', 'Web Development', 'AI / Machine Learning', 'Cyber Security', 'Mobile Development', 'Cloud Computing', 'DevOps', 'Other'
];

// Helper to get query params
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home = () => {
  const { blogs, loading, fetchBlogs, deleteBlog } = useContext(BlogContext);
  const { user } = useContext(AuthContext);
  const query = useQuery();
  const navigate = useNavigate();
  
  const currentCategory = query.get('category') || 'All';
  const currentSearch = query.get('search') || '';
  const currentTag = query.get('tag') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    // Re-fetch when URL queries change
    const filters = {};
    if (currentCategory && currentCategory !== 'All') filters.category = currentCategory;
    if (currentSearch) filters.search = currentSearch;
    if (currentTag) filters.tag = currentTag;
    
    fetchBlogs(filters);
  }, [currentCategory, currentSearch, currentTag, fetchBlogs]);

  // Handle Search Submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput)}`);
    } else {
      navigate('/');
    }
  };

  // Utility to stringify rich text
  const stripHtml = (html) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlog(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', paddingTop: '30px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(65px, 80px) 1fr minmax(280px, 320px)', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Left Sidebar (Menus & Categories) */}
        <div className="left-sidebar">
          
          {/* Main Navigation Menu */}
          <div className="sidebar-menu">
             <Link to="/" className={`menu-item ${!currentCategory || currentCategory === 'All' ? 'active' : ''}`}>
               <HomeIcon size={24} style={{ flexShrink: 0 }} /> <span>My Feed</span>
             </Link>
             <Link to="/bookmarks" className="menu-item">
               <Bookmark size={24} style={{ flexShrink: 0 }} /> <span>Bookmarks</span>
             </Link>
             <div className="menu-item" onClick={() => { navigate('/'); window.scrollTo(0,0); }} style={{ cursor: 'pointer' }}>
               <Compass size={24} style={{ flexShrink: 0 }} /> <span>Explore</span>
             </div>
             {user && (
               <Link to="/write" className="menu-item highlight">
                 <Terminal size={24} style={{ flexShrink: 0 }} /> <span>Write Article</span>
               </Link>
             )}
          </div>

          <div style={{ height: '1px', background: 'var(--border)' }}></div>

          {/* Categories / Tech Topics */}
          <div>
            <h3 className="topic-title" style={{ fontSize: '1.1rem', marginBottom: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '1px', paddingLeft: '8px' }}>
              <TagIcon size={20} style={{ flexShrink: 0 }} /> <span>Tech Topics</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {CATEGORIES.slice(1).map(cat => (
                <Link 
                  key={cat} 
                  to={`/?category=${encodeURIComponent(cat)}`}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '8px',
                    background: currentCategory === cat ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    color: currentCategory === cat ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: currentCategory === cat ? '700' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    borderLeft: currentCategory === cat ? '3px solid var(--primary)' : '3px solid transparent'
                  }}
                  className="category-link"
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentCategory === cat ? 'var(--primary)' : 'var(--border)', flexShrink: 0 }}></div>
                  <span className="category-text">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed Content (Center) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', minWidth: 0 }}>
          
          {/* Hero / Filter Header */}
          <div style={{ marginBottom: '10px' }}>
            {currentSearch || currentTag || (currentCategory !== 'All') ? (
              <div style={{ padding: '20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', color: 'var(--text-main)' }}>
                  {currentSearch && <span>Search: <strong className="gradient-text">"{currentSearch}"</strong></span>}
                  {currentTag && <span>Tag: <strong className="gradient-text">#{currentTag}</strong></span>}
                  {currentCategory !== 'All' && !currentSearch && !currentTag && <span>Browsing: <strong className="gradient-text">{currentCategory}</strong></span>}
                </div>
                <Link to="/" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>Clear Filters</Link>
              </div>
            ) : (
              <div style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '800' }}>Welcome to <span className="gradient-text">TechLogs</span></h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Discover the latest in software engineering, AI, DevOps, and more.</p>
              </div>
            )}
          </div>

          {loading ? (
             <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ display: 'inline-block', marginBottom: '15px' }}>
                 <Zap size={32} color="var(--primary)" />
               </motion.div>
               <p>Fetching the tech timeline...</p>
             </div>
          ) : blogs.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ padding: '80px 20px', textAlign: 'center', background: 'var(--bg-card)', borderStyle: 'dashed', borderWidth: '2px' }}>
              <div style={{ display: 'inline-flex', padding: '20px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%', marginBottom: '20px' }}>
                <Terminal size={40} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>No logs found.</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '30px' }}>Adjust your filters or be the first to write on this topic.</p>
              <Link to="/write" className="btn btn-primary" style={{ padding: '14px 30px', fontSize: '1.1rem' }}>Create Post</Link>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="card blog-card"
                    style={{ position: 'relative', overflow: 'hidden' }}
                  >
                    <div style={{ padding: '30px' }}>
                      {blog.thumbnail && (
                        <div style={{ width: '100%', height: '280px', borderRadius: '12px', overflow: 'hidden', marginBottom: '25px', border: '1px solid var(--border)' }}>
                          <img src={blog.thumbnail} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                           <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', flexShrink: 0 }}>
                              {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'U'}
                           </div>
                           <div>
                             {blog.author?.name && <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>{blog.author.name}</div>}
                             <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                               <span style={{ width: '4px', height: '4px', background: 'var(--text-muted)', borderRadius: '50%' }}></span>
                               <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={12}/> {blog.readingTime} min read</span>
                             </div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                           {user && blog.author && user._id === blog.author._id && (
                             <button onClick={(e) => handleDelete(e, blog._id)} style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', padding: '6px 12px', borderRadius: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '600', transition: 'all 0.2s' }}>
                               <Trash2 size={14} /> Delete
                             </button>
                           )}
                           <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.5px' }}>
                             {blog.category}
                           </span>
                        </div>
                      </div>
                      
                      <h2 style={{ fontSize: '1.9rem', marginBottom: '15px', lineHeight: '1.3', fontWeight: '800' }}>
                        <Link to={`/blog/${blog._id}`} className="blog-title">{blog.title}</Link>
                      </h2>
                      
                      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.1rem', marginBottom: '25px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {blog.plainTextSummary || stripHtml(blog.content)}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '25px' }}>
                         {blog.tags?.slice(0,4).map(tag => (
                           <Link to={`/?tag=${encodeURIComponent(tag)}`} key={tag} className="tag-chip">
                             #{tag}
                           </Link>
                         ))}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: '600' }}>
                             <Heart size={18} className="icon-hover-red" /> {blog.likes?.length || 0}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.95rem', fontWeight: '600' }}>
                             <Search size={18} /> {blog.views || 0}
                          </span>
                        </div>
                        
                        <Link to={`/blog/${blog._id}`} style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '0.95rem', transition: 'color 0.2s' }} className="read-more-link">
                          Read Post <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Right Sidebar (Search & Trending) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'sticky', top: '100px' }}>
           
           {/* Modern Search Box */}
           <div className="card glass-panel" style={{ padding: '25px 20px', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                <Search size={20} color="var(--primary)" /> Deep Search
              </h3>
              <form onSubmit={handleSearch} style={{ display: 'flex', position: 'relative' }}>
                 <input 
                   type="text" 
                   value={searchInput}
                   onChange={e => setSearchInput(e.target.value)}
                   placeholder="Titles, tags..." 
                   className="search-input"
                 />
                 <button type="submit" className="search-btn">
                   <ArrowRight size={18} color="white" />
                 </button>
              </form>
           </div>

           {/* Trending Widget */}
           <div className="card" style={{ padding: '0', background: 'var(--bg-card)' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <TrendingUp size={20} color="var(--success)" /> Top Trending
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                 {blogs.slice(0, 4).sort((a,b) => (b.views || 0) - (a.views || 0)).map((tBlog, i) => (
                    <Link to={`/blog/${tBlog._id}`} key={`trend-${tBlog._id}`} className="trending-item">
                       <div className="trending-number">0{i+1}</div>
                       <div style={{ flex: 1 }}>
                         <h4 style={{ fontSize: '0.95rem', lineHeight: '1.4', marginBottom: '4px', color: 'var(--text-main)', fontWeight: '600' }}>{tBlog.title}</h4>
                         <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tBlog.views || 0} reads</span>
                       </div>
                    </Link>
                 ))}
                 {blogs.length === 0 && <span style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>No trending blogs yet.</span>}
              </div>
           </div>

           {/* Premium Ad removed based on user feedback */}
        </div>

      </div>
    </div>
  );
};

export default Home;
