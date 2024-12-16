const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
require('dotenv').config();
jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "test" });
  await mongoose.connection.asPromise();
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Comprehensive Integration Test: User Interactions and Content Management', () => {
  let userToken, secondUserToken, tweetId, secondTweetId;

  it('tests user registration, login, interactions, and content management', async () => {
    // User registration
    let res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'firstUser',
        email: 'firstUser@mail.com',
        password: 'securepassword'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;

    // Second user registration
    res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'secondUser',
        email: 'secondUser@mail.com',
        password: 'anotherpassword'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    secondUserToken = res.body.token;

    // User login
    res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'firstUser@mail.com',
        password: 'securepassword'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');

    // Create a tweet by first user
    res = await request(app)
      .post('/api/v1/tweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ content: 'This is a test tweet by firstUser' });
    expect(res.status).toBe(200);
    tweetId = res.body.tweet._id;

    // Create another tweet by second user
    res = await request(app)
      .post('/api/v1/tweets')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({ content: 'This is a test tweet by secondUser' });
    expect(res.status).toBe(200);
    secondTweetId = res.body.tweet._id;

    // Follow first user from second user's account
    res = await request(app)
      .post(`/api/v1/users/follow/firstUser`)
      .set('Authorization', `Bearer ${secondUserToken}`);
    expect(res.status).toBe(200);

    // First user likes second user's tweet
    res = await request(app)
      .post(`/api/v1/tweets/${secondTweetId}/like`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);

    // Second user retweets first user's tweet
    res = await request(app)
      .post(`/api/v1/tweets/${tweetId}/retweet`)
      .set('Authorization', `Bearer ${secondUserToken}`);
    expect(res.status).toBe(200);

    // First user updates their bio
    res = await request(app)
      .patch('/api/v1/users/firstUser')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ bio: 'Updated bio for firstUser' });
    expect(res.status).toBe(200);

    // Delete first user's tweet
    res = await request(app)
      .delete(`/api/v1/tweets/${tweetId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });
});
