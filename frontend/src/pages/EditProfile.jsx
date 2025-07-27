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
  const [loading, setLoading] = useState(true); // Start with loading true
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
      const response = await api.get(`/users/${userId}`);
      
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
      console.error('Failed to fetch user:', err);
      setError(err.response?.data?.message || 'Failed to load user data. Please try again.');
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code ...

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

      // Only include password if it's not empty
      if (form.password) {
        updateData.password = form.password;
      }

      await api.put(`/users/${userId}`, updateData);
      setMessage('Profile updated successfully');
      
      // Update localStorage if name changed
      if (form.name !== localStorage.getItem('user_name')) {
        localStorage.setItem('user_name', form.name);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
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