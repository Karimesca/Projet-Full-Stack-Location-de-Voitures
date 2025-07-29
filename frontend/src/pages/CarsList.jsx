import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './CarsList.css';

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cars');
      setCars(res.data);
      setFilteredCars(res.data);

      const uniqueBrands = [...new Set(res.data.map(car => car.brand))];
      setBrands(uniqueBrands);
    } catch (err) {
      console.error('Error fetching cars', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    let filtered = [...cars];

    if (selectedBrand) {
      filtered = filtered.filter(car => car.brand === selectedBrand);
    }

    if (selectedStatus) {
      filtered = filtered.filter(car => car.status === selectedStatus);
    }

    setFilteredCars(filtered);
  };

  const resetFilter = () => {
    setSelectedBrand('');
    setSelectedStatus('');
    setFilteredCars(cars);
  };

  return (
    <div className="cars-list-container">
      <div className="cars-header">
        <h2>Available Cars</h2>
        <p className="subtitle">Choose from our wide selection of vehicles</p>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Brand</label>
          <select
            className="form-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((brand, index) => (
              <option key={index} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            className="form-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>

        <div className="filter-buttons">
          <button className="btn btn-primary" onClick={handleFilter}>
            <i className="fas fa-filter me-2"></i>Filter
          </button>
          <button className="btn btn-outline-secondary" onClick={resetFilter}>
            <i className="fas fa-sync-alt me-2"></i>Reset
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading cars...</p>
        </div>
      ) : (
        /* Car List */
        <div className="cars-grid">
          {filteredCars.length === 0 ? (
            <div className="no-cars">
              <i className="fas fa-car-crash fa-3x mb-3"></i>
              <p>No cars found matching your criteria</p>
            </div>
          ) : (
            filteredCars.map(car => (
              <div key={car.id} className="car-card">
                <div className="car-image-container">
                  {car.img_url ? (
                    <img
                      src={car.img_url}
                      alt={`${car.brand} ${car.model}`}
                      className="car-image"
                      onLoad={(e) => {
                        const img = e.target;
                        if (img.naturalWidth > img.naturalHeight) {
                          img.classList.add('landscape');
                        } else {
                          img.classList.add('portrait');
                        }
                      }}
                    />
                  ) : (
                    <div className="car-image-placeholder">
                      <i className="fas fa-car fa-3x"></i>
                    </div>
                  )}
                  <div className={`car-status ${car.status}`}>
                    {car.status === 'available' ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                <div className="car-details">
                  <h3>{car.brand} {car.model}</h3>
                  <div className="car-specs">
                    <div className="spec">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{car.year}</span>
                    </div>
                    <div className="spec">
                      <i className="fas fa-gas-pump"></i>
                      <span>{car.fuel_type}</span>
                    </div>
                    <div className="spec">
                      <i className="fas fa-tag"></i>
                      <span>{car.price} DH/day</span>
                    </div>
                  </div>
                  {car.status === 'available' && (
                    <button
                      className="btn btn-primary reserve-btn"
                      onClick={() => navigate(`/reserve/${car.id}`)}
                    >
                      <i className="fas fa-calendar-check me-2"></i>Reserve Now
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CarsList;