import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTweets } from '../redux/tweetsSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const tweets = useSelector(state => state.tweets.list);

  useEffect(() => {
    dispatch(fetchTweets());
  }, [dispatch]);

  if (!user) return <div className="container mt-4">Loading...</div>;

  const userTweets = tweets.filter(t => t.author?._id === user._id);

  console.log(userTweets);

  return (
    <div className="container mt-4">
      <h1>Profile Page</h1>
      <h3>{user.name} (@{user.username})</h3>
      <p>{user.bio}</p>

      <h4>My Tweets</h4>
      {userTweets.length === 0 ? (
        <p>No tweets yet.</p>
      ) : (
        userTweets.map(tweet => (
          <div className="card mt-2" key={tweet._id}>
            <div className="card-body">
              <p>{tweet.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
