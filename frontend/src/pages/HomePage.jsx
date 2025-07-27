import React from 'react';
import CarsList from './CarsList';
import './HomePage.css'; // Add this line

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Car Rental</h1>
          <p className="lead">Find the perfect car for your next adventure</p>
          <a href="/cars" className="btn btn-primary btn-lg">
            Browse Our Fleet
          </a>
        </div>
      </div>
      <div className="container mt-5">
        <CarsList />
      </div>
    </div>
  );
};

export default HomePage;