import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser, fetchMe } from '../redux/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('testuser');
  const [email, setEmail] = useState('testuser@example.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Test User');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ username, email, password, name }));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Register successful!');
      await dispatch(fetchMe(result.payload.token));
      navigate('/');
    } else {
      toast.error('Register failed!');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Username</label>
          <input className="form-control" value={username} onChange={(e)=>setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
        <button className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default Register;
