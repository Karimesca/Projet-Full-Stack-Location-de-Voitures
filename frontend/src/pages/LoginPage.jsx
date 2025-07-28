import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      
      // Store all authentication data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user.id);
      localStorage.setItem('user_role', response.data.user.role);
      localStorage.setItem('name', response.data.user.name);

      // Redirect to intended page or default based on role
      const from = location.state?.from?.pathname || 
                  (response.data.user.role === 'admin' ? '/admin' : '/cars');
      navigate(from, { replace: true });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">
          <i className="fas fa-sign-in-alt me-2"></i>Login
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input 
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
                placeholder="Enter your email"
              />
            </div>
          </div>
          <div className="form-group mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input 
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          <div className="text-center mt-3">
            <p className="mb-0">
              Don't have an account?{' '}
              <a href="/register" className="text-primary">Register here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;