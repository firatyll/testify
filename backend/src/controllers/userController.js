const User = require('../models/User');

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserFollowers = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate('followers', '-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ followers: user.followers });
  } catch (err) {
    next(err);
  }
};

exports.getUserFollowing = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate('following', '-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ following: user.following });
  } catch (err) {
    next(err);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userToFollow = await User.findOne({ username });
    const currentUser = await User.findById(req.user);

    if (!userToFollow) return res.status(404).json({ msg: 'User to follow not found' });
    if (userToFollow._id.equals(currentUser._id)) return res.status(400).json({ msg: 'Cannot follow yourself' });

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      await currentUser.save();
    }

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id);
      await userToFollow.save();
    }

    res.json({ msg: 'Followed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const userToUnfollow = await User.findOne({ username });
    const currentUser = await User.findById(req.user);

    if (!userToUnfollow) return res.status(404).json({ msg: 'User not found' });

    currentUser.following = currentUser.following.filter(u => !u.equals(userToUnfollow._id));
    userToUnfollow.followers = userToUnfollow.followers.filter(u => !u.equals(currentUser._id));

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ msg: 'Unfollowed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ msg: 'Username required' });

    const user = await User.findById(req.user);
    if (user.username !== username) return res.status(403).json({ msg: 'Not allowed' });

    const { name, bio, profileImage, coverImage } = req.body;
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (coverImage !== undefined) user.coverImage = coverImage;
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
