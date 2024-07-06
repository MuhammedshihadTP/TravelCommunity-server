const express = require('express');
const router = express.Router();

const { likePost, unlikePost } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');


// Like/Unlike routes
router.post('/:postId',protect, likePost);
router.post('/:postId/unlike',protect, unlikePost);

module.exports = router;
