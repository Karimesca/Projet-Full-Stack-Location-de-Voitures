import React, { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCar, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaBars, FaChartLine, FaUsers, FaCog, FaExchangeAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Car management state
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: '',
    fuel_type: '',
    price: '',
    status: 'available',
    img_url: '',
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
        price: '',
        status: 'available',
        img_url: '',
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
    setActiveTab('add-car'); // Switch to add/edit tab
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

  // Update car price
  const handlePriceUpdate = async (carId, newPrice) => {
    try {
      await api.patch(`/cars/${carId}`, { price: newPrice });
      fetchCars();
    } catch (err) {
      console.error('Error updating price', err);
    }
  };

  // Toggle car status
  const toggleCarStatus = async (carId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
      await api.patch(`/cars/${carId}`, { status: newStatus });
      fetchCars();
    } catch (err) {
      console.error('Error updating status', err);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add-car':
        return <CarFormComponent 
          form={form} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          editingCar={editingCar}
          message={message}
          error={error}
        />;
      case 'manage-cars':
        return <CarListComponent 
          cars={cars} 
          loading={loading} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete}
          handlePriceUpdate={handlePriceUpdate}
          toggleCarStatus={toggleCarStatus}
        />;
      case 'dashboard':
      default:
        return <DashboardComponent cars={cars} />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div 
        className={`bg-dark text-white ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
        style={{
          width: sidebarCollapsed ? '80px' : '250px',
          transition: 'width 0.3s',
          position: 'relative'
        }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center">
          {!sidebarCollapsed && <h4 className="m-0">Admin Panel</h4>}
          <button 
            className="btn btn-link text-white"
            onClick={toggleSidebar}
          >
            <FaBars />
          </button>
        </div>
        <hr className="my-0 bg-secondary" />
        <ul className="nav flex-column p-3">
          <li className="nav-item">
            <button 
              className={`nav-link btn btn-link text-start text-white ${activeTab === 'dashboard' ? 'active bg-primary' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaChartLine className="me-2" />
              {!sidebarCollapsed && 'Dashboard'}
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link btn btn-link text-start text-white ${activeTab === 'add-car' ? 'active bg-primary' : ''}`}
              onClick={() => {
                setActiveTab('add-car');
                setEditingCar(null);
                setForm({
                  brand: '',
                  model: '',
                  year: '',
                  fuel_type: '',
                  price: '',
                  status: 'available',
                  img_url: '',
                });
              }}
            >
              <FaCar className="me-2" />
              {!sidebarCollapsed && 'Add/Edit Car'}
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link btn btn-link text-start text-white ${activeTab === 'manage-cars' ? 'active bg-primary' : ''}`}
              onClick={() => setActiveTab('manage-cars')}
            >
              <FaEdit className="me-2" />
              {!sidebarCollapsed && 'Manage Cars'}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        {/* Top Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container-fluid">
            <span className="navbar-brand">Car Rental Admin</span>
            <div className="d-flex align-items-center">
              <button className="btn btn-outline-secondary me-3">
                <FaUsers className="me-1" />
                Users
              </button>
              <button className="btn btn-outline-secondary">
                <FaCog />
              </button>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="container-fluid py-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardComponent = ({ cars }) => {
  const availableCars = cars.filter(car => car.status === 'available').length;
  const unavailableCars = cars.filter(car => car.status === 'unavailable').length;
  
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Cars</h5>
              <p className="card-text display-4">{cars.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Available Cars</h5>
              <p className="card-text display-4">{availableCars}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Unavailable Cars</h5>
              <p className="card-text display-4">{unavailableCars}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Car Form Component
const CarFormComponent = ({ form, handleChange, handleSubmit, editingCar, message, error }) => (
  <div>
    <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Brand</label>
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Model</label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Year</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="form-control"
                  type="number"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Fuel Type</label>
                <input
                  name="fuel_type"
                  value={form.fuel_type}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price (DH)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="form-control"
                  type="number"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              name="img_url"
              value={form.img_url}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          {form.img_url && (
            <div className="mb-3">
              <img src={form.img_url} alt="Car" className="img-fluid" style={{ maxHeight: '200px' }} />
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {editingCar ? <FaEdit /> : <FaPlus />} {editingCar ? 'Update Car' : 'Add Car'}
          </button>
        </form>
      </div>
    </div>
  </div>
);

// Car List Component
const CarListComponent = ({ cars, loading, handleEdit, handleDelete, handlePriceUpdate, toggleCarStatus }) => {
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const startPriceEdit = (car) => {
    setEditingPriceId(car.id);
    setNewPrice(car.price);
  };

  const cancelPriceEdit = () => {
    setEditingPriceId(null);
    setNewPrice('');
  };

  const savePriceEdit = (carId) => {
    handlePriceUpdate(carId, newPrice);
    setEditingPriceId(null);
    setNewPrice('');
  };

  return (
    <div>
      <h2>Manage Cars</h2>
      {loading ? (
        <div className="alert alert-info">Loading cars...</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Fuel Type</th>
                    <th>Price (DH)</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map(car => (
                    <tr key={car.id}>
                      <td>{car.brand}</td>
                      <td>{car.model}</td>
                      <td>{car.year}</td>
                      <td>{car.fuel_type}</td>
                      <td>
                        {editingPriceId === car.id ? (
                          <div className="input-group" style={{ width: '150px' }}>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={newPrice}
                              onChange={(e) => setNewPrice(e.target.value)}
                            />
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => savePriceEdit(car.id)}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={cancelPriceEdit}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <button 
                              className="btn btn-link btn-sm p-0 me-2"
                              onClick={() => startPriceEdit(car)}
                              style={{ minWidth: '20px' }}
                            >
                              <FaEdit />
                            </button>
                            <span>{car.price}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          car.status === 'available' ? 'bg-success' : 'bg-danger'
                        }`}>
                          {car.status}
                        </span>
                      </td>
                      <td>
                        {car.img_url && (
                          <img 
                            src={car.img_url} 
                            alt={`${car.brand} ${car.model}`} 
                            style={{ width: '50px', height: 'auto' }} 
                          />
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button 
                            className="btn btn-warning btn-sm d-flex align-items-center"
                            onClick={() => handleEdit(car)}
                          >
                            <FaEdit className="me-1" /> Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm d-flex align-items-center"
                            onClick={() => handleDelete(car.id)}
                          >
                            <FaTrash className="me-1" /> Delete
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm d-flex align-items-center"
                            onClick={() => toggleCarStatus(car.id, car.status)}
                          >
                            <FaExchangeAlt className="me-1" /> Toggle Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;