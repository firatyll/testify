import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tweetsReducer from './tweetsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tweets: tweetsReducer
  }
});

export default store;
