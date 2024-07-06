const express = require('express');
const { updateProfile, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload,updateProfile);

module.exports = router;
