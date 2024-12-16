import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getTweetsApi, 
  createTweetApi, 
  deleteTweetApi, 
  likeTweetApi, 
  unlikeTweetApi,
  retweetApi,
  unretweetApi,
  replyToTweetApi,
  getTweetByIdApi
} from '../api/tweets';

export const fetchTweets = createAsyncThunk('tweets/fetchTweets', async (_, { rejectWithValue }) => {
  try {
    const response = await getTweetsApi();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Fetch tweets failed');
  }
});

export const fetchTweetsById = createAsyncThunk('tweets/fetchTweetsById', async ({ content }, { rejectWithValue }) => {
  try {
    const response = await getTweetByIdApi(content);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Fetch tweets failed');
  }
});

export const createTweet = createAsyncThunk('tweets/createTweet', async ({ content, token }, { dispatch, rejectWithValue }) => {
  try {
    await createTweetApi({ content }, token);
    dispatch(fetchTweets()); 
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Create tweet failed');
  }
});

export const deleteTweet = createAsyncThunk('tweets/deleteTweet', async ({ tweetId, token }, { dispatch, rejectWithValue }) => {
  try {
    await deleteTweetApi(tweetId, token);
    dispatch(fetchTweets());
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Delete tweet failed');
  }
});

export const likeTweet = createAsyncThunk('tweets/likeTweet', async ({ tweetId, token }, { dispatch, rejectWithValue }) => {
  try {
    await likeTweetApi(tweetId, token);
    dispatch(fetchTweets());
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Like tweet failed');
  }
});

export const unlikeTweet = createAsyncThunk('tweets/unlikeTweet', async ({ tweetId, token }, { dispatch, rejectWithValue }) => {
  try {
    await unlikeTweetApi(tweetId, token);
    dispatch(fetchTweets());
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Unlike tweet failed');
  }
});

export const retweet = createAsyncThunk('tweets/retweet', async ({ tweetId, token }, { dispatch, rejectWithValue }) => {
  try {
    await retweetApi(tweetId, token);
    dispatch(fetchTweets());
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Retweet failed');
  }
});

export const unretweet = createAsyncThunk('tweets/unretweet', async ({ tweetId, token }, { dispatch, rejectWithValue }) => {
  try {
    await unretweetApi(tweetId, token);
    dispatch(fetchTweets());
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Unretweet failed');
  }
});

export const replyTweet = createAsyncThunk('tweets/replyTweet', async ({ tweetId, content, token }, { dispatch, rejectWithValue }) => {
  try {
    await replyToTweetApi(tweetId, { content }, token);
    dispatch(fetchTweets());
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Reply tweet failed');
  }
});

const tweetsSlice = createSlice({
  name: 'tweets',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.list = action.payload.tweets;
      })
  }
});

export default tweetsSlice.reducer;
