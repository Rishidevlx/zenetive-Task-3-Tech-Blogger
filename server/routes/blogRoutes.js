const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all blogs (with optional filters)
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, tag, search, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (tag) {
      query.tags = { $in: [tag] };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { plainTextSummary: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'trending') {
      sortOptions = { views: -1, likes: -1 };
    } else if (sort === 'popular') {
      sortOptions = { likes: -1 };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name role')
      .sort(sortOptions);
      
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get user's own blogs
// @route   GET /api/blogs/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate('author', 'name role')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name role bio')
      .populate('comments.user', 'name');
      
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count dynamically on fetch
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, plainTextSummary, category, tags, thumbnail } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Please provide title, content and category' });
    }

    const blog = await Blog.create({
      title,
      content,
      plainTextSummary,
      category,
      author: req.user.id,
      tags: tags || [],
      thumbnail
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to edit this blog' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Like / Unlike a Blog
// @route   PUT /api/blogs/:id/like
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the blog has already been liked by this user
    const isLiked = blog.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter(id => id.toString() !== req.user.id);
    } else {
      // Like
      blog.likes.push(req.user.id);
    }

    await blog.save();
    res.json(blog.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Add Comment to Blog
// @route   POST /api/blogs/:id/comment
// @access  Private
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ message: 'Comment text is required' });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = {
      user: req.user.id,
      name: req.user.name,
      text
    };

    blog.comments.unshift(newComment); // Add to beginning of array
    await blog.save();

    // Populate user for the returned comments array
    await blog.populate('comments.user', 'name');

    res.json(blog.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
