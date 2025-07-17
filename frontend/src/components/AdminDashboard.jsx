import React, { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCar, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    fuel_type: '',
    seats: '',
    price: '',
    status: 'disponible',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch cars from backend
  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cars');
      setCars(res.data);
    } catch (err) {
      setError('Error fetching cars');
      console.error('Error fetching cars', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit new or edited car
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      if (editingCar) {
        await api.put(`/cars/${editingCar.id}`, form);
        setMessage('Car updated successfully!');
        setEditingCar(null);
      } else {
        await api.post('/cars', form);
        setMessage('Car added successfully!');
      }
      setForm({
        brand: '',
        model: '',
        year: '',
        fuel_type: '',
        seats: '',
        price: '',
        status: 'disponible',
        image_url: '',
      });
      fetchCars();
    } catch (err) {
      setError('Error saving car');
      console.error('Error saving car', err);
    }
  };

  // Start editing a car
  const handleEdit = (car) => {
    setEditingCar(car);
    setForm({ ...car });
  };

  // Delete a car
  const handleDelete = async (id) => {
    setMessage('');
    setError('');
    try {
      await api.delete(`/cars/${id}`);
      setMessage('Car deleted successfully!');
      fetchCars();
    } catch (err) {
      setError('Error deleting car');
      console.error('Error deleting car', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      {loading && <div className="alert alert-info">Loading cars...</div>}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <input
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />
            <input
              name="model"
              placeholder="Model"
              value={form.model}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />
            <input
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              required
              className="form-control mb-2"
              type="number"
            />
          </div>
          <div className="col-md-6">
            <input
              name="fuel_type"
              placeholder="Fuel Type"
              value={form.fuel_type}
              onChange={handleChange}
              required
              className="form-control mb-2"
            />
            <input
              name="seats"
              placeholder="Seats"
              value={form.seats}
              onChange={handleChange}
              required
              className="form-control mb-2"
              type="number"
            />
            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="form-control mb-2"
              type="number"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <input
              name="status"
              placeholder="Status"
              value={form.status}
              onChange={handleChange}
              className="form-control mb-2"
            />
            <input
              name="image_url"
              placeholder="Image URL"
              value={form.image_url}
              onChange={handleChange}
              className="form-control mb-2"
            />
            {form.image_url && (
              <img src={form.image_url} alt="Car" className="img-fluid mt-2" style={{ maxHeight: '200px' }} />
            )}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingCar ? <FaEdit /> : <FaPlus />} {editingCar ? 'Update Car' : 'Add Car'}
        </button>
      </form>

      <h3>Existing Cars</h3>
      <ul className="list-group">
        {cars.map(car => (
          <li key={car.id} className="list-group-item d-flex justify-content-between align-items-center">
            {car.brand} {car.model} - {car.price} DH per day - {car.status}
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(car)}>
                <FaEdit /> Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car.id)}>
                <FaTrash /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
