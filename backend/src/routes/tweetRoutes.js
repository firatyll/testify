const express = require('express');
const auth = require('../middlewares/authMiddleware');
const { createTweet, getTweets, getTweetById, deleteTweet, likeTweet, unlikeTweet, retweet, unretweet, replyTweet } = require('../controllers/tweetController');

const router = express.Router();

router.get('/', getTweets);
router.post('/', auth, createTweet);
router.get('/:id', getTweetById);
router.delete('/:id', auth, deleteTweet);
router.post('/:id/like', auth, likeTweet);
router.post('/:id/unlike', auth, unlikeTweet);
router.post('/:id/retweet', auth, retweet);
router.post('/:id/unretweet', auth, unretweet);
router.post('/:id/reply', auth, replyTweet);

module.exports = router;
