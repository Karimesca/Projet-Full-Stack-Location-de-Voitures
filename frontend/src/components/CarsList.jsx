import React, { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCar, FaMoneyBillWave } from 'react-icons/fa';

const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All Brands'); // Default to "All Brands"
  
  // Fixed list of brands
  const brands = ["All Brands", "Toyota", "Renault", "Dacia", "Hyundai"];

  useEffect(() => {
    // Fetching cars data
    api.get('/cars')
      .then(res => {
        setCars(res.data);
        setFilteredCars(res.data); // Initialize filteredCars with all cars
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    // Filter cars based on selected brand
    const filtered = cars.filter(car => {
      return selectedBrand === "All Brands" || car.brand === selectedBrand;
    });
    setFilteredCars(filtered);
  }, [selectedBrand, cars]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Cars</h2>
      
      {/* Filter UI */}
      <div className="mb-4">
        <select 
          value={selectedBrand} // Set the default selected value
          onChange={(e) => setSelectedBrand(e.target.value)} 
          className="form-select"
        >
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div className="row">
        {filteredCars.map(car => (
          <div key={car.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={car.image_url} className="card-img-top" alt={`${car.brand} ${car.model}`} />
              <div className="card-body">
                <h5 className="card-title">{car.brand} {car.model} ({car.year})</h5>
                <p className="card-text">Fuel Type: {car.fuel_type}</p>
                <p className="card-text">
                  <FaMoneyBillWave className="me-1" />
                  {car.price} DH per day
                </p>
              </div>
              <div className="card-footer text-center">
                <span className="badge bg-success">Disponible</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarsList;
