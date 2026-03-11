import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Editor theme
import BlogContext from '../context/BlogContext';
import { motion } from 'framer-motion';

const CATEGORIES = [
  'Web Development', 'AI / Machine Learning', 'Cyber Security', 'Mobile Development', 'Cloud Computing', 'DevOps', 'Other'
];

const Write = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [thumbnail, setThumbnail] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const { createBlog } = useContext(BlogContext);
  const navigate = useNavigate();

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || content === '<p><br></p>') {
      setError('Title and content are required.');
      return;
    }
    
    setPublishing(true);
    setError('');

    try {
      // Create rough plain text snippet for index
      const plainTextSummary = content.replace(/<[^>]+>/g, '').substring(0, 200) + '...';
      
      const newBlog = await createBlog({
        title,
        content,
        plainTextSummary,
        category,
        tags,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000'
      });
      navigate(`/blog/${newBlog._id}`);
    } catch (err) {
      setError(err.message || 'Failed to publish post');
      setPublishing(false);
    }
  };

  // Quill Editor Configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="container" style={{ maxWidth: '900px', marginTop: '40px', paddingBottom: '80px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '30px' }}>Write a New Post</h1>
        
        {error && (
          <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', border: '1px solid var(--danger)', borderRadius: '6px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Post Title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ fontSize: '2rem', padding: '15px 20px', fontWeight: 'bold', background: 'transparent', border: 'none', borderBottom: '2px solid var(--border)', color: 'var(--text-main)', borderRadius: '0', paddingLeft: 0, paddingRight: 0 }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '30px', marginBottom: '30px', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '12px' }}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
               <label>Cover Image URL (Optional)</label>
               <input 
                 type="url" 
                 placeholder="https://images.unsplash.com/..." 
                 value={thumbnail}
                 onChange={(e) => setThumbnail(e.target.value)}
                 style={{ padding: '12px' }}
               />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label>Tags (Max 5)</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <input 
                 type="text" 
                 placeholder="Add tag and press Enter" 
                 value={tagInput}
                 onChange={(e) => setTagInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                 disabled={tags.length >= 5}
                 style={{ flex: 1, padding: '12px' }}
               />
               <button onClick={handleAddTag} disabled={tags.length >= 5} className="btn btn-outline" style={{ padding: '12px 20px', borderRadius: '6px' }}>Add</button>
            </div>
            
            {tags.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                {tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group" style={{ background: 'white', borderRadius: '6px', overflow: 'hidden', paddingBottom: '0' }}>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              placeholder="Tell your story..."
              style={{ color: '#0F172A' }} // force stark constrast for reading regardless of dark mode wrapper
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
            <button 
              type="submit" 
              disabled={publishing} 
              className="btn btn-primary" 
              style={{ padding: '12px 30px', fontSize: '1.1rem', borderRadius: '8px' }}
            >
              {publishing ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
          
        </form>
      </motion.div>
    </div>
  );
};

export default Write;
