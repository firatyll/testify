import axios from './axiosInstance';

export const registerApi = (userData) => axios.post('/auth/register', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    name: userData.name
});
export const loginApi = (loginData) => axios.post('/auth/login', loginData);
