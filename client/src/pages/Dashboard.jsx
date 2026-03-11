import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, PenSquare, Trash2, ExternalLink, Globe, Lock } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import BlogContext from '../context/BlogContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { userPosts, fetchUserPosts, loading, deletePost, togglePublishStatus } = useContext(BlogContext);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    await togglePublishStatus(id, newStatus);
  };

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Please login to view your dashboard</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}
        >
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Welcome, {user.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your blog posts and drafts.</p>
          </div>
          <Link to="/create-post" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1.1rem' }}>
            <PlusCircle size={20} /> New Post
          </Link>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>Loading your dashboard...</div>
        ) : userPosts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card" style={{ textAlign: 'center', padding: '60px 20px' }}
          >
            <PenSquare size={64} color="var(--border)" style={{ margin: '0 auto 20px auto' }} />
            <h2 style={{ marginBottom: '15px' }}>Let's get writing!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>You haven't written any posts yet. Start sharing your ideas.</p>
            <Link to="/create-post" className="btn btn-outline" style={{ padding: '12px 30px' }}>Write your first post</Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {userPosts.map((post, index) => (
              <motion.div 
                key={post._id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                className="card card-hover" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}
              >
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.4rem' }}>{post.title}</h3>
                    <span style={{ 
                      padding: '4px 12px', fontSize: '0.8rem', fontWeight: '600', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px',
                      background: post.status === 'published' ? 'var(--success)' : '#F1F5F9',
                      color: post.status === 'published' ? 'white' : 'var(--text-muted)'
                    }}>
                      {post.status === 'published' ? <Globe size={14} /> : <Lock size={14} />}
                      {post.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', gap: '15px' }}>
                    <span>Category: <strong>{post.category}</strong></span>
                    <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={() => handleToggleStatus(post._id, post.status)}
                    className="btn btn-outline"
                    style={{ background: post.status === 'draft' ? '#DBEAFE' : '#FEF3C7', color: post.status === 'draft' ? 'var(--secondary)' : '#D97706', borderColor: 'transparent' }}
                  >
                    {post.status === 'draft' ? 'Publish' : 'Unpublish'}
                  </button>
                  
                  {post.status === 'published' && (
                    <Link to={`/post/${post._id}`} className="btn btn-outline" style={{ border: 'none', background: '#F1F5F9' }}>
                      <ExternalLink size={18} />
                    </Link>
                  )}
                  
                  <Link to={`/edit-post/${post._id}`} className="btn btn-outline" style={{ border: 'none', background: '#F1F5F9' }}>
                    <PenSquare size={18} /> Edit
                  </Link>

                  <button onClick={() => handleDelete(post._id)} className="btn btn-danger" style={{ border: 'none', background: '#FEE2E2', padding: '10px 14px' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
