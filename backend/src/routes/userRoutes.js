const express = require('express');
const auth = require('../middlewares/authMiddleware');
const { getMe, getUserByUsername, getUserFollowers, getUserFollowing, followUser, unfollowUser, updateProfile } = require('../controllers/userController');
const router = express.Router();

router.get('/me', auth, getMe);
router.get('/:username', getUserByUsername);
router.get('/:username/followers', getUserFollowers);
router.get('/:username/following', getUserFollowing);
router.post('/follow/:username', auth, followUser);
router.post('/unfollow/:username', auth, unfollowUser);
router.patch('/:username', auth, updateProfile);

module.exports = router;
