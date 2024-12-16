const jwt = require('jsonwebtoken');

const generateToken = (userId, secret) => {
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

module.exports = generateToken;
