const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const hashPassword = require('../utils/hashPassword');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Missing fields' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await hashPassword(password);
    const user = await User.create({ username, email, password: hashed, name });

    const token = generateToken(user._id, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
};
