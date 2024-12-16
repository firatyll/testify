const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ msg: 'Twitter Clone Backend Running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/tweets', tweetRoutes);


app.use(errorHandler);

module.exports = app;
