import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ES6
import { motion } from 'framer-motion';
import { Save, Send, Image as ImageIcon } from 'lucide-react';
import BlogContext from '../context/BlogContext';

const CreateEditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createPost, updatePost, userPosts } = useContext(BlogContext);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    status: 'draft',
    tags: ''
  });
  const [content, setContent] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { title, category, status, tags } = formData;

  useEffect(() => {
    if (id) {
      const existingPost = userPosts.find(p => p._id === id);
      if (existingPost) {
        setFormData({
          title: existingPost.title,
          category: existingPost.category || 'Technology',
          status: existingPost.status,
          tags: existingPost.tags?.join(', ') || ''
        });
        setContent(existingPost.content);
      }
    }
  }, [id, userPosts]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!title || !content || content === '<p><br></p>') {
      setFormError('Title and Content are required.');
      setIsSubmitting(false);
      return;
    }

    const postData = {
      title,
      content,
      category,
      status,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (id) {
        await updatePost(id, postData);
      } else {
        await createPost(postData);
      }
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message);
      setIsSubmitting(false);
    }
  };

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
    <div className="container" style={{ padding: '40px 0', minHeight: '100vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: '900px', margin: '0 auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem' }}>{id ? 'Edit Story' : 'Write a Story'}</h1>
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline"
          >
            Cancel
          </button>
        </div>

        {formError && (
          <div style={{ padding: '15px', background: '#FEF2F2', color: 'var(--danger)', borderRadius: '8px', marginBottom: '25px', border: '1px solid var(--danger)' }}>
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="card" style={{ padding: '40px', overflow: 'visible' }}>
          
          <div className="form-group">
            <input 
              type="text" 
              name="title" 
              value={title} 
              onChange={onChange} 
              placeholder="Post Title..." 
              required
              style={{ fontSize: '2rem', padding: '15px 0', border: 'none', borderBottom: '2px solid var(--border)', borderRadius: '0', background: 'transparent' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label>Category</label>
              <select name="category" value={category} onChange={onChange}>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: '1 1 200px' }}>
              <label>Tags (comma separated)</label>
              <input type="text" name="tags" value={tags} onChange={onChange} placeholder="react, frontend, html" />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '40px' }}>
            <label style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Content</label>
            <div style={{ borderRadius: '8px', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                modules={modules}
                placeholder="Share your thoughts..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <select 
                name="status" 
                value={status} 
                onChange={onChange}
                style={{ padding: '10px 20px', minWidth: '150px', background: status === 'draft' ? '#F1F5F9' : '#ECFDF5', color: status === 'draft' ? 'var(--text-muted)' : 'var(--success-hover)', borderColor: 'transparent', fontWeight: 'bold' }}
              >
                <option value="draft">Save as Draft</option>
                <option value="published">Publish Immediately</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '14px 30px', fontSize: '1.1rem' }}>
              {isSubmitting ? 'Saving...' : status === 'draft' ? <><Save size={20}/> Save Draft</> : <><Send size={20}/> Publish Now</>}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default CreateEditPost;
