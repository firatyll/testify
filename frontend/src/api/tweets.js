import axios from './axiosInstance';

export const createTweetApi = (tweetContent, token) => axios.post('/tweets', tweetContent, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getTweetsApi = () => axios.get('/tweets');
export const getTweetByIdApi = (tweetId) => axios.get(`/tweets/${tweetId}`);
export const deleteTweetApi = (tweetId, token) => axios.delete(`/tweets/${tweetId}`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const likeTweetApi = (tweetId, token) => axios.post(`/tweets/${tweetId}/like`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const unlikeTweetApi = (tweetId, token) => axios.post(`/tweets/${tweetId}/unlike`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const retweetApi = (tweetId, token) => axios.post(`/tweets/${tweetId}/retweet`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const unretweetApi = (tweetId, token) => axios.post(`/tweets/${tweetId}/unretweet`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const replyToTweetApi = (tweetId, content, token) => axios.post(`/tweets/${tweetId}/reply`, content, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
