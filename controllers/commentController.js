// controllers/commentController.js
const Post = require('../models/post');
const User = require('../models/user');
const { getSocketIO } = require('../config/socketIO'); 

const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const { text } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId).select('name profilePicture');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate({
        path: 'comments.user',
        select: 'name profilePicture',
      })
      .exec();

      
      
    const io = getSocketIO();
    io.emit('newComment', {
      postId: post._id,
      comment: populatedPost.comments[populatedPost.comments.length - 1],
      user: {
        name: user.name,
        profilePicture: user.profilePicture
      }
    }); 
    const ownerId = post?.user?._id.toString();
    if(userId !==ownerId){
      io.to(ownerId).emit('notification', {
        type: 'comment',
        message: `${user.name} has a commented on your post `,
        
      });
    }
   

   

    res.status(200).json(populatedPost);
  } catch (error) {
    console.error('Error in addComment:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
    if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('Error in deleteComment:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, deleteComment };
