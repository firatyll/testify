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

let username = "test";
let email = "test@mail.com";
let password = "123456";
let token;
let testusername = 'test2';
let testemail = 'test2@mail.com';
let testpassword = "123456";

describe('Auth Controller', () => {

  describe("register", () => {

    it("should return 400 if missing fields", async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: 'Missing fields' });
    });

    it("should return 200 if user is created", async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ username: username, email: email, password: password });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
    });

    it("should return 400 if user already exists", async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ username: username, email: email, password: password });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: 'User already exists' });
    });

  });

  describe("login", () => {

    it("should return 400 if missing fields", async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: 'Missing fields' });
    });

    it("should return 400 if user not found", async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'firatyll@mail.com', password: "123456" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: 'User not found' });
    });

    it("should return 400 if invalid credentials", async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: email, password: "1234567" });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ msg: 'Invalid credentials' });
    });

    it("should return 200 if user is logged in", async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: email, password: password });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      token = res.body.token;
    });

  });

});

describe('User Controller', () => {

  it("should generate a new user for test cases", async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: testusername, email: testemail, password: testpassword });
    expect(res.status).toBe(200);
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app)
      .get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ msg: 'No token provided' });
  });

  it("should return 401 if invalid token", async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', 'Bearer invalidToken');
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ msg: 'Invalid token' });
  });

  it("should return 200 if user is fetched", async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
  });

  it("should return 404 if user not found", async () => {
    const res = await request(app)
      .get('/api/v1/users/firatyll');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'User not found' });
  });

  it("should return 404 if user followers not found", async () => {
    const res = await request(app)
      .get('/api/v1/users/firatyll/followers');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'User not found' });
  });

  it("should return 200 if user followers are fetched", async () => {
    const res = await request(app)
      .get(`/api/v1/users/${testusername}/followers`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('followers');
  });

  it("should return 404 if user following not found", async () => {
    const res = await request(app)
      .get('/api/v1/users/firatyll/following');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'User not found' });
  });

  it("should return 200 if user following are fetched", async () => {
    const res = await request(app)
      .get(`/api/v1/users/${testusername}/following`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('following');
  });

  it("should return 404 if user to follow not found", async () => {
    const res = await request(app)
      .post('/api/v1/users/follow/firatyll')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'User to follow not found' });
  });

  it("should return 400 if cannot follow yourself", async () => {
    const res = await request(app)
      .post('/api/v1/users/follow/test')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ msg: 'Cannot follow yourself' });
  });

  it("should return 200 if user is followed", async () => {
    const res = await request(app)
      .post(`/api/v1/users/follow/${testusername}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 200 if user is unfollowed", async () => {
    const res = await request(app)
      .post(`/api/v1/users/unfollow/${testusername}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 200 if user is updated", async () => {
    const res = await request(app)
      .patch(`/api/v1/users/test`)
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Test bio' });
    expect(res.status).toBe(200);
  });

});

describe('Tweet Controller', () => {

  let tweetId;

  it("should return 400 if missing fields", async () => {
    const res = await request(app)
      .post('/api/v1/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ msg: 'Content required' });
  });

  it("should return 200 if tweet is created", async () => {
    const res = await request(app)
      .post('/api/v1/tweets')
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Test tweet' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tweet');
    tweetId = res.body.tweet._id;
  });

  it("should return 200 if tweets are fetched", async () => {
    const res = await request(app)
      .get('/api/v1/tweets');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('tweets');
  });

  it("should return 404 if tweet not found", async () => {
    const res = await request(app)
      .get('/api/v1/tweets/notweet');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ msg: 'Tweet not found' });
  });

  it("should return 200 if tweet is liked", async () => {
    const res = await request(app)
      .post(`/api/v1/tweets/${tweetId}/like`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 200 if tweet is unliked", async () => {
    const res = await request(app)
      .post(`/api/v1/tweets/${tweetId}/unlike`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 200 if tweet is retweeted", async () => {
    const res = await request(app)
      .post(`/api/v1/tweets/${tweetId}/retweet`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 200 if retweet is removed", async () => {
    const res = await request(app)
      .post(`/api/v1/tweets/${tweetId}/unretweet`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("should return 200 if tweet is replied", async () => {
    const res = await request(app)
      .post(`/api/v1/tweets/${tweetId}/reply`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Test reply' });
    expect(res.status).toBe(200);
  });

  it("should return 200 if tweet is deleted", async () => {
    const res = await request(app)
      .delete(`/api/v1/tweets/${tweetId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });


});
