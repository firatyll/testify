const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  retweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }]
}, { timestamps: true });

module.exports = mongoose.model('Tweet', tweetSchema);
