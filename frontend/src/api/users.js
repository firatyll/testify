import axios from './axiosInstance';

export const getMeApi = (token) => axios.get('/users/me', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getUserByUsername = (username) => axios.get(`/users/${username}`);
export const followUserApi = (username, token) => axios.post(`/users/follow/${username}`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const unfollowUserApi = (username, token) => axios.post(`/users/unfollow/${username}`, {}, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const updateProfileApi = (username, userData, token) => axios.patch(`/users/${username}`, userData, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
