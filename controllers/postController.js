const Post = require('../models/Post');
const User = require('../models/User');

const createPost = async (req, res) => {
  const { content, country } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const post = await Post.create({ user: req.user.id, content, image, country });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: 'user',
        select: '_id name profilePicture' 
      })
      .populate({
        path: 'comments.user',
        select: '_id name profilePicture' 
      })
      .populate({
        path: 'likes',
        select: '_id name profilePicture'
      })
      .populate({
        path: 'dislikes',
        select: '_id name profilePicture' 
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getPostsByCountry = async (req, res) => {
  const { country } = req.params;
  try {
    const posts = await Post.find({ country }).populate('user', 'name profilePicture').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getPosts, getPostsByCountry };
