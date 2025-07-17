import React, { useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCar, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';

const ReservationForm = () => {
  const [form, setForm] = useState({
    user_id: 1, // replace with logged-in user
    car_id: '',
    start_date: '',
    end_date: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/reservations', form);
      setMessage('Reservation created successfully!');
      // Optionally reset form fields
      setForm({
        user_id: 1, // reset user_id if needed
        car_id: '',
        start_date: '',
        end_date: ''
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create reservation. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reservation Form</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="car_id" className="form-label">Car ID</label>
          <div className="input-group">
            <span className="input-group-text"><FaCar /></span>
            <input
              name="car_id"
              id="car_id"
              placeholder="Enter Car ID"
              onChange={handleChange}
              value={form.car_id}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="start_date" className="form-label">Start Date</label>
          <div className="input-group">
            <span className="input-group-text"><FaCalendarAlt /></span>
            <input
              name="start_date"
              id="start_date"
              type="date"
              onChange={handleChange}
              value={form.start_date}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="end_date" className="form-label">End Date</label>
          <div className="input-group">
            <span className="input-group-text"><FaCalendarCheck /></span>
            <input
              name="end_date"
              id="end_date"
              type="date"
              onChange={handleChange}
              value={form.end_date}
              className="form-control"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Reserve</button>
      </form>
    </div>
  );
};

export default ReservationForm;
