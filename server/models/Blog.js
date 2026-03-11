const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a blog title'],
    trim: true
  },
  content: {
    type: String, // Stored as HTML from React Quill
    required: [true, 'Please add blog content']
  },
  plainTextSummary: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Web Development', 'AI / Machine Learning', 'Cyber Security', 'Mobile Development', 'Cloud Computing', 'DevOps', 'Other']
  },
  tags: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    type: String,
    default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to calculate reading time roughly based on plainText length or content length
blogSchema.pre('save', function() {
  const textBody = this.plainTextSummary || this.content || "";
  const words = textBody.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
  const minutes = Math.ceil(words / 200); // avg 200 words per min
  this.readingTime = minutes < 1 ? 1 : minutes;
});

module.exports = mongoose.model('Blog', blogSchema);
