require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const blog = new Blog({
      title: 'Test Title',
      content: 'Html content <p>test</p>',
      plainTextSummary: 'plain text max 300',
      category: 'Web Development',
      author: new mongoose.Types.ObjectId(),
      tags: ['test', 'tags'],
      thumbnail: 'https://example.com/img.jpg'
    });
    
    await blog.save();
    console.log("SUCCESS");
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
  process.exit();
}
test();
