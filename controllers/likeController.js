const { getSocketIO } = require('../config/socketIO');
const Post = require('../models/post');
const User = require('../models/user');

const likePost = async (req, res) => {
  const { postId } = req.params;
  const  userId  = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

  
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
    } else {
      return res.status(400).json({ message: 'Post already liked' });
    }

    const io = getSocketIO(); 

    const ownerId = post?.user?._id.toString();
    if (ownerId!==userId) {
      io.to(ownerId).emit('notification', {
        type: 'like',
        message: `${user.name} has a Liked on your post `,
       });
    }
   

    // Remove user from dislikes if present
    post.dislikes = post.dislikes.filter(id => !id.equals(userId));

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const  userId = req.user.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Remove user from likes if present
    post.likes = post.likes.filter(id => !id.equals(userId));

    // Add user to dislikes if not already disliked
    if (!post.dislikes.includes(userId)) {
      post.dislikes.push(userId);
    } else {
      return res.status(400).json({ message: 'Post already disliked' });
    }

 
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { likePost, unlikePost };
