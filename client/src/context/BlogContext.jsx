import { createContext, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [singleBlog, setSingleBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);

  // Fetch all blogs with optional filters (category, tag, search, sort)
  const fetchBlogs = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await axios.get(`/api/blogs?${queryParams}`);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSingleBlog = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/blogs/${id}`);
      setSingleBlog(res.data);
    } catch (error) {
      console.error('Error fetching single blog:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserBlogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get('/api/blogs/me');
      setUserBlogs(res.data);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBlog = async (blogData) => {
    try {
      const res = await axios.post('/api/blogs', blogData);
      setUserBlogs([res.data, ...userBlogs]);
      setBlogs([res.data, ...blogs]);
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating blog');
    }
  };

  const likeBlog = async (id) => {
    try {
      const res = await axios.put(`/api/blogs/${id}/like`);
      // Update local states to reflect new likes array
      setBlogs(blogs.map(b => b._id === id ? { ...b, likes: res.data } : b));
      if (singleBlog && singleBlog._id === id) {
        setSingleBlog({ ...singleBlog, likes: res.data });
      }
      return res.data;
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const addComment = async (id, text) => {
    try {
      const res = await axios.post(`/api/blogs/${id}/comment`, { text });
      if (singleBlog && singleBlog._id === id) {
        setSingleBlog({ ...singleBlog, comments: res.data });
      }
      return res.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error adding comment');
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`/api/blogs/${id}`);
      setUserBlogs(userBlogs.filter(b => b._id !== id));
      setBlogs(blogs.filter(b => b._id !== id));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error deleting blog');
    }
  };

  return (
    <BlogContext.Provider value={{
      blogs,
      singleBlog,
      userBlogs,
      loading,
      fetchBlogs,
      fetchSingleBlog,
      fetchUserBlogs,
      createBlog,
      likeBlog,
      addComment,
      deleteBlog
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
