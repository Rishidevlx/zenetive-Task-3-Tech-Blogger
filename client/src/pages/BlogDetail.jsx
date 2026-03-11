import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Heart, MessageSquare, BookmarkPlus, BookmarkCheck, Share2 } from 'lucide-react';
import BlogContext from '../context/BlogContext';
import AuthContext from '../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { singleBlog: post, loading: contextLoading, fetchSingleBlog, likeBlog, addComment } = useContext(BlogContext);
  const { user, saveBlog } = useContext(AuthContext);

  useEffect(() => {
    // Fetch using context to keep singleBlog in sync if needed
    const loadData = async () => {
      setLoading(true);
      await fetchSingleBlog(id);
      setLoading(false);
    };
    loadData();
  }, [id, fetchSingleBlog]);

  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleLike = async () => {
    if (!user) return alert("Please log in to like articles.");
    await likeBlog(id);
  };

  const handleSave = async () => {
    if (!user) return alert("Please log in to save articles.");
    await saveBlog(id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to comment.");
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await addComment(id, commentText);
      setCommentText('');
    } catch(err) {
      alert("Failed to submit comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const isLiked = post?.likes?.includes(user?._id);
  const isSaved = Array.isArray(user?.savedBlogs) && user.savedBlogs.some(saved => 
    (typeof saved === 'object' ? saved._id : saved) === post?._id
  );

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading Article...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--danger)' }}>{error}</div>;
  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Post not found</div>;

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Article Header */}
      <div style={{ background: 'var(--bg-main)', padding: '60px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '30px', fontWeight: '600' }}>
              <ArrowLeft size={18} /> Back to Articles
            </Link>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: 'white', background: 'var(--primary)', padding: '6px 16px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {post.category}
              </span>
            </div>

            <h1 className="serif-font" style={{ fontSize: '3.5rem', lineHeight: '1.2', marginBottom: '30px', color: 'var(--text-main)' }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '30px', color: 'var(--text-muted)', fontSize: '1.05rem', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              {post.author?.name && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <User size={18} /> <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{post.author.name}</span>
                 </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} /> {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Body */}
      <div className="container" style={{ maxWidth: '800px', marginTop: '50px' }}>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="ql-editor" 
          style={{ fontSize: '1.15rem', lineHeight: '1.9', color: 'var(--text-main)' }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        {/* Interactive Floating Action Bar */}
        <div style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '30px' }}>
             <button onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? 'var(--danger)' : 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500', transition: 'all 0.2s' }}>
                <Heart size={24} fill={isLiked ? 'var(--danger)' : 'none'} /> {post.likes?.length || 0}
             </button>
             <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'default', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
                <MessageSquare size={24} /> {post.comments?.length || 0}
             </button>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
             <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? 'var(--secondary)' : 'var(--text-muted)', transition: 'all 0.2s' }} title={isSaved ? "Saved to Bookmarks" : "Save Article"}>
                {isSaved ? <BookmarkCheck size={26} fill="var(--secondary)" color="white" /> : <BookmarkPlus size={26} />}
             </button>
             <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }} title="Share">
                <Share2 size={24} />
             </button>
          </div>
        </div>
        
        {/* Comments Section */}
        <div style={{ marginTop: '60px' }}>
           <h3 style={{ fontSize: '1.8rem', marginBottom: '30px', borderBottom: '2px solid var(--border)', paddingBottom: '15px' }}>Discussion ({post.comments?.length || 0})</h3>
           
           {user ? (
             <form onSubmit={handleCommentSubmit} style={{ marginBottom: '40px', background: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
               <textarea 
                 value={commentText}
                 onChange={e => setCommentText(e.target.value)}
                 placeholder="What are your thoughts?"
                 style={{ width: '100%', minHeight: '100px', padding: '15px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', resize: 'vertical', marginBottom: '15px' }}
                 required
               />
               <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                 <button type="submit" disabled={submittingComment} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '6px' }}>
                   {submittingComment ? 'Posting...' : 'Respond'}
                 </button>
               </div>
             </form>
           ) : (
             <div style={{ padding: '30px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center', marginBottom: '40px' }}>
               <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Log in to join the discussion.</p>
               <Link to="/login" className="btn btn-outline">Sign In</Link>
             </div>
           )}

           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {post.comments?.map((comment, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ display: 'flex', gap: '15px' }}>
                   <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), var(--primary))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', flexShrink: 0 }}>
                      {comment.name ? comment.name.charAt(0).toUpperCase() : 'U'}
                   </div>
                   <div style={{ flex: 1, background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                         <h4 style={{ fontSize: '1.05rem', fontWeight: 'bold' }}>{comment.name}</h4>
                         <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                           {new Date(comment.date).toLocaleDateString()}
                         </span>
                      </div>
                      <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>{comment.text}</p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </div>

    </div>
  );
};

export default BlogDetail;
