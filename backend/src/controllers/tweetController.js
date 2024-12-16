const Tweet = require('../models/Tweet');
const User = require('../models/User');

exports.createTweet = async (req, res, next) => {
  try {
    const { content, images } = req.body;
    if (!content) return res.status(400).json({ msg: 'Content required' });

    const tweet = await Tweet.create({ author: req.user, content, images });
    res.json({ tweet });
  } catch (err) {
    next(err);
  }
};

exports.getTweets = async (req, res, next) => {
  try {
    const { followingOnly } = req.query;
    let filter = {};
    if (followingOnly === 'true') {
      const user = await User.findById(req.user);
      filter = { author: { $in: user.following } };
    }
    const tweets = await Tweet.find(filter).populate('author', '-password').sort({ createdAt: -1 });
    res.json({ tweets });
  } catch (err) {
    next(err);
  }
};

exports.getTweetById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id).populate('author', '-password');
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });
    return res.json({ tweet });
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tweet not found' });
    }
    next(err);
  }
};

exports.deleteTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });
    if (!tweet.author.equals(req.user)) return res.status(403).json({ msg: 'Not allowed' });

    await Tweet.deleteOne({ _id: id });
    res.json({ msg: 'Tweet deleted' });
  } catch (err) {
    next(err);
  }
};


exports.likeTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });

    if (!tweet.likes.includes(req.user)) {
      tweet.likes.push(req.user);
      await tweet.save();
    }
    res.json({ msg: 'Tweet liked' });
  } catch (err) {
    next(err);
  }
};

exports.unlikeTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });

    tweet.likes = tweet.likes.filter(u => !u.equals(req.user));
    await tweet.save();
    res.json({ msg: 'Tweet unliked' });
  } catch (err) {
    next(err);
  }
};

exports.retweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });

    if (!tweet.retweets.includes(req.user)) {
      tweet.retweets.push(req.user);
      await tweet.save();
    }
    res.json({ msg: 'Tweet retweeted' });
  } catch (err) {
    next(err);
  }
};

exports.unretweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ msg: 'Tweet not found' });

    tweet.retweets = tweet.retweets.filter(u => !u.equals(req.user));
    await tweet.save();
    res.json({ msg: 'Retweet removed' });
  } catch (err) {
    next(err);
  }
};

exports.replyTweet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: 'Content required' });

    const parentTweet = await Tweet.findById(id);
    if (!parentTweet) return res.status(404).json({ msg: 'Tweet not found' });

    const reply = await Tweet.create({ author: req.user, content });
    parentTweet.replies.push(reply._id);
    await parentTweet.save();

    res.json({ reply });
  } catch (err) {
    next(err);
  }
};
