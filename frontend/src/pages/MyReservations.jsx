import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './MyReservations.css';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Optional: for error handling

  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [res1, res2] = await Promise.all([
          api.get('/reservations'),
          api.get('/cars')
        ]);

        const userReservations = res1.data.filter(r => r.user_id === parseInt(userId));
        setReservations(userReservations);
        setCars(res2.data);
      } catch (err) {
        console.error('Failed to load reservations or cars', err);
        setError('Failed to load reservations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchReservations();
    }
  }, [userId]);

  const getCar = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model}` : 'Car not found';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success';
      case 'pending':
        return 'bg-warning text-dark';
      case 'completed':
        return 'bg-info';
      case 'cancelled':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  };

  if (!userId) {
    return (
      <div className="alert alert-warning">
        Please login to view your reservations.
      </div>
    );
  }

  return (
    <div className="my-reservations-container">
      <div className="reservations-header">
        <h2>
          <i className="fas fa-calendar-check me-2"></i>
          My Reservations
        </h2>
        <p className="subtitle">View and manage your bookings</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="no-reservations">
          <i className="fas fa-calendar-times fa-3x mb-3"></i>
          <h4>No reservations yet</h4>
          <p>You haven't made any reservations yet. Start by browsing our cars!</p>
          <a href="/cars" className="btn btn-primary">
            <i className="fas fa-car me-2"></i>Browse Cars
          </a>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map(res => (
            <div key={res.id} className="reservation-item">
              <div className="reservation-info">
                <div className="reservation-car">
                  <h5>{getCar(res.car_id)}</h5>
                  <div className="reservation-dates">
                    <div>
                      <i className="fas fa-calendar-day me-2"></i>
                      {formatDate(res.start_date)}
                    </div>
                    <div>
                      <i className="fas fa-calendar-day me-2"></i>
                      {formatDate(res.end_date)}
                    </div>
                  </div>
                </div>
                <div className="reservation-status">
                  <span className={`badge ${getStatusBadgeClass(res.status)}`}>
                    {res.status}
                  </span>
                </div>
              </div>
              <div className="reservation-actions">
                {res.status === 'pending' && (
                  <button className="btn btn-outline-danger btn-sm">
                    <i className="fas fa-times me-1"></i>Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;