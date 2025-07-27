import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReservation } from '../services/api';
import './ReservationForm.css';

const ReservationForm = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/cars/${carId}`);
        setCar(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load car details');
        console.error('Fetch car error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!startDate) {
      errors.startDate = 'Start date is required';
    } else if (startDate < today) {
      errors.startDate = 'Start date cannot be in the past';
    }
    
    if (!endDate) {
      errors.endDate = 'End date is required';
    } else if (startDate && endDate <= startDate) {
      errors.dateRange = 'End date must be after start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) return;

    if (!userId || !token) {
      setError('You must be logged in to make a reservation');
      navigate('/login', { state: { from: `/cars/${carId}/reserve` } });
      return;
    }

    setLoading(true);

    try {
      const response = await createReservation({
        user_id: userId,
        car_id: parseInt(carId),
        start_date: startDate,
        end_date: endDate
      }, token);

      setMessage('Reservation created successfully!');
      
      // Update local car status immediately
      setCar(prev => ({ ...prev, status: 'unavailable' }));
      
      setTimeout(() => navigate('/my-reservations'), 2000);
    } catch (err) {
      console.error('Reservation error:', err);
      
      let errorMsg = 'Failed to create reservation. Please try again.';
      if (err.response) {
        if (err.response.status === 400) {
          errorMsg = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMsg = 'Session expired. Please login again.';
          navigate('/login', { state: { from: `/cars/${carId}/reserve` } });
        } else if (err.response.status === 404) {
          errorMsg = err.response.data.message || 'Car or user not found';
        } else if (err.response.data.sqlError) {
          errorMsg = 'Database error occurred';
        }
      }
      
      setError(errorMsg);
      
      // Refresh car data if there was a conflict
      if (err.response?.status === 400 && err.response.data.message.includes('available')) {
        const res = await api.get(`/cars/${carId}`);
        setCar(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !car) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading car details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="alert alert-danger">
        {error || 'Car not found or failed to load details'}
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="reservation-container">
      <div className="reservation-card">
        <div className="reservation-header">
          <h2>
            <i className="fas fa-calendar-alt me-2"></i>
            Reserve {car.brand} {car.model}
          </h2>
          <div className="car-info">
            <img 
              src={car.img_url || '/default-car.jpg'} 
              alt={`${car.brand} ${car.model}`}
              className="car-thumbnail"
            />
            <div>
              <p><strong>Year:</strong> {car.year}</p>
              <p><strong>Price:</strong> {car.price} DH/day</p>
              <p className={car.status === 'available' ? 'text-success' : 'text-danger'}>
                <strong>Status:</strong> {car.status}
              </p>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={today}
              max={maxDateStr}
              required
            />
            {formErrors.startDate && (
              <div className="invalid-feedback">{formErrors.startDate}</div>
            )}
          </div>

          <div className="form-group mb-4">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || today}
              max={maxDateStr}
              required
            />
            {formErrors.endDate && (
              <div className="invalid-feedback">{formErrors.endDate}</div>
            )}
            {formErrors.dateRange && (
              <div className="text-danger small mt-1">{formErrors.dateRange}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2"
            disabled={loading || car.status !== 'available'}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Processing...
              </>
            ) : (
              <>
                <i className="fas fa-calendar-check me-2"></i>
                {car.status === 'available' ? 'Confirm Reservation' : 'Car Not Available'}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;