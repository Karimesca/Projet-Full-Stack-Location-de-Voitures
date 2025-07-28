import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './EditProfile.css';

const EditProfile = () => {
  const userId = localStorage.getItem('user_id');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [userId, navigate]);

  const fetchUserData = async () => {
    try {
      setError('');
      setLoading(true);
      console.log(`Fetching user data for ID: ${userId}`); // Debug log
      
      const response = await api.get(`/users/${userId}`); // Updated endpoint
      console.log('API Response:', response.data); // Debug log

      if (response.data) {
        setForm({
          name: response.data.name || '',
          email: response.data.email || '',
          password: '' // Never pre-fill password
        });
      } else {
        throw new Error('No user data received');
      }
    } catch (err) {
      console.error('API Error Details:', {
        message: err.message,
        config: err.config,
        response: err.response?.data,
        status: err.response?.status
      });

      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError('Session expired. Please login again.');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_name');
            navigate('/login');
            break;
          case 404:
            setError('User not found. Please check your account.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError(err.response.data?.message || 'Failed to load user data');
        }
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const updateData = {
        name: form.name,
        email: form.email
      };

      if (form.password.trim() !== '') {
        if (form.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        updateData.password = form.password;
      }

      const response = await api.put(`/users/${userId}`, updateData);
      console.log('Update Response:', response.data); // Debug log

      setMessage('Profile updated successfully!');
      
      // Update localStorage if name changed
      if (form.name !== localStorage.getItem('user_name')) {
        localStorage.setItem('user_name', form.name);
      }

      // Clear password field after successful update
      setForm({ ...form, password: '' });

    } catch (err) {
      console.error('Update Error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.name) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>
            <i className="fas fa-user-edit me-2"></i>
            Edit Your Profile
          </h2>
          <p className="subtitle">Update your personal information</p>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                className="form-control"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">New Password (optional)</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                className="form-control"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                disabled={loading}
                minLength="6"
              />
            </div>
            <small className="form-text text-muted">
              Password must be at least 6 characters long
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Update Profile
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-outline-secondary ms-2"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;