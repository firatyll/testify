import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTweets,
  createTweet,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  retweet,
  unretweet,
  replyTweet
} from '../redux/tweetsSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tweets = useSelector(state => state.tweets.list);
  const { token, user } = useSelector(state => state.auth);

  const [content, setContent] = useState('');

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [currentTweetId, setCurrentTweetId] = useState(null);

  useEffect(() => {
    dispatch(fetchTweets());
  }, [dispatch]);

  const handleCreateTweet = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("You must be logged in to create a tweet");
      return;
    }
    const result = await dispatch(createTweet({ content, token }));
    if (createTweet.fulfilled.match(result)) {
      toast.success('Tweet created!');
      setContent('');
    } else {
      toast.error('Failed to create tweet');
    }
  };

  const handleDelete = async (tweetId) => {
    const result = await dispatch(deleteTweet({ tweetId, token }));
    if (deleteTweet.fulfilled.match(result)) {
      toast.success('Tweet deleted!');
    } else {
      toast.error('Failed to delete tweet');
    }
  };

  const handleLike = async (tweetId) => {
    const result = await dispatch(likeTweet({ tweetId, token }));
    if (!likeTweet.fulfilled.match(result)) {
      toast.error('Failed to like tweet');
    }
  };

  const handleUnlike = async (tweetId) => {
    const result = await dispatch(unlikeTweet({ tweetId, token }));
    if (!unlikeTweet.fulfilled.match(result)) {
      toast.error('Failed to unlike tweet');
    }
  };

  const handleRetweet = async (tweetId) => {
    const result = await dispatch(retweet({ tweetId, token }));
    if (!retweet.fulfilled.match(result)) {
      toast.error('Failed to retweet');
    }
  };

  const handleUnretweet = async (tweetId) => {
    const result = await dispatch(unretweet({ tweetId, token }));
    if (!unretweet.fulfilled.match(result)) {
      toast.error('Failed to unretweet');
    }
  };

  const openReplyModal = (tweetId) => {
    if (!token) {
      toast.error('You must be logged in to reply');
      return;
    }
    setCurrentTweetId(tweetId);
    setReplyContent('');
    setShowReplyModal(true);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply content cannot be empty');
      return;
    }
    const result = await dispatch(replyTweet({ tweetId: currentTweetId, content: replyContent, token }));
    if (!replyTweet.fulfilled.match(result)) {
      toast.error('Failed to reply');
    } else {
      toast.success('Replied successfully');
      setShowReplyModal(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Home</h1>
      {token ? (
        <div className="mb-3">
          <form onSubmit={handleCreateTweet}>
            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}>
              </textarea>
            </div>
            <button className="btn btn-primary">Tweet</button>
          </form>
        </div>
      ) : (
        <p>Please <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>login</span> to see and post tweets.</p>
      )}

      {token ? (
        tweets.map(tweet => (
          <div className="card mt-2" key={tweet._id}>
            <div className="card-body">
              <h5>@{tweet.author?.username || 'Unknown'}</h5>
              <p>{tweet.content}</p>
              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleLike(tweet._id)}>Like ({tweet.likes.length || 0})</button>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleUnlike(tweet._id)}>Unlike</button>
                <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleRetweet(tweet._id)}>Retweet ({tweet.retweets.length || 0})</button>
                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleUnretweet(tweet._id)}>Unretweet</button>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openReplyModal(tweet._id)}>Reply ({tweet.replies.length || 0})</button>
                {user && tweet.author && user._id === tweet.author._id && (
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(tweet._id)}>Delete</button>
                )}
              </div>
            </div>
            {tweet.replies.length > 0 && (
              tweet.replies.map(reply => (
                <div className="card m-2" key={reply._id}>
                  <div className="card-body">
                    <h5>@{reply.author.username}</h5>
                    <p>{reply.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      ) : (<></>)}

      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Your Reply</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReplySubmit}>
            Send Reply
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
