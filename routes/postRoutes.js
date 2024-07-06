const express = require('express');
const { createPost, getPosts, getPostsByCountry } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/', protect,upload, createPost);
router.get('/', getPosts);
router.get('/country/:country', getPostsByCountry);

module.exports = router;
