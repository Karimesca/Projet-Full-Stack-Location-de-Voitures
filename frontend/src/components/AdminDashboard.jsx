import React, { useEffect, useState } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCar, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaBars, FaChartLine, FaUsers, FaCog, FaExchangeAlt, FaCalendarAlt, FaSun, FaMoon, FaUserCog, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminDashboard.css'
// Enhanced CSS with better dark mode
const enhancedStyles = `
  body.dark-mode {
    color: #f8f9fa;
    background-color: #121212;
  }

  body.dark-mode .card {
    background-color: #1e1e1e;
    color: #f8f9fa;
    border-color: #2d2d2d;
  }

  body.dark-mode .form-control {
    background-color: #2d2d2d;
    color: #f8f9fa;
    border-color: #3d3d3d;
  }

  body.dark-mode .form-control:focus {
    background-color: #2d2d2d;
    color: #f8f9fa;
    border-color: #4d4d4d;
    box-shadow: 0 0 0 0.25rem rgba(100, 100, 100, 0.25);
  }

  body.dark-mode .table-dark {
    --bs-table-bg: #1e1e1e;
    --bs-table-striped-bg: #252525;
    --bs-table-striped-color: #f8f9fa;
    --bs-table-active-bg: #353535;
    --bs-table-active-color: #f8f9fa;
    --bs-table-hover-bg: #2a2a2a;
    --bs-table-hover-color: #f8f9fa;
    color: #f8f9fa;
    border-color: #3d3d3d;
  }

  body.dark-mode .navbar {
    background-color: #1a1a1a !important;
    border-bottom: 1px solid #2d2d2d !important;
  }

  body.dark-mode .sidebar {
    background-color: #1a1a1a !important;
    border-right: 1px solid #2d2d2d !important;
  }

  body.dark-mode .sidebar .nav-link {
    color: #d1d1d1 !important;
  }

  body.dark-mode .sidebar .nav-link:hover {
    background-color: #2a2a2a !important;
  }

  body.dark-mode .sidebar .nav-link.active {
    background-color: #3a3a3a !important;
    color: white !important;
  }

  body.dark-mode .badge {
    color: white !important;
  }

  /* Password input group */
  .password-input-group {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 5;
    color: #6c757d;
  }

  /* Loading spinner */
  .loading-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: 0.25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border 0.75s linear infinite;
  }

  @keyframes spinner-border {
    to { transform: rotate(360deg); }
  }
`;

// Inject the styles
const styleElement = document.createElement('style');
styleElement.innerHTML = enhancedStyles;
document.head.appendChild(styleElement);

const AdminDashboard = () => {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

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

  // Reservations management state
  const [reservations, setReservations] = useState([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply dark mode classes to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

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

  // Fetch reservations from backend
  const fetchReservations = async () => {
    setLoadingReservations(true);
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (err) {
      setError('Error fetching reservations');
      console.error('Error fetching reservations', err);
    } finally {
      setLoadingReservations(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  // Handle user form input
  const handleUserChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  };

  // Submit user form with password validation
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    // Password validation
    if (!editingUser && (!userForm.password || userForm.password.length < 6)) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const userData = { 
        name: userForm.name,
        email: userForm.email,
        role: userForm.role
      };

      // Only include password if it's not empty (for edits) or if creating new user
      if (userForm.password) {
        userData.password = userForm.password;
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, userData);
        setMessage('User updated successfully');
      } else {
        await api.post('/users', userData);
        setMessage('User created successfully');
      }
      
      fetchUsers();
      setUserForm({ name: '', email: '', role: 'client', password: '' });
      setEditingUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user');
      console.error('Error saving user', err);
    }
  };

  // Edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, role: user.role, password: '' });
    setActiveTab('manage-users');
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchReservations();
    fetchUsers();
  }, []);

  // Handle form input for cars
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
    setActiveTab('add-car');
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

  // Update reservation status
  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      await api.put(`/reservations/${reservationId}`, { status: newStatus });
      fetchReservations();
    } catch (err) {
      console.error('Error updating reservation status', err);
    }
  };

  // Delete reservation
  const handleDeleteReservation = async (id) => {
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      console.error('Error deleting reservation', err);
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
          darkMode={darkMode}
        />;
      case 'manage-cars':
        return <CarListComponent
          cars={cars}
          loading={loading}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePriceUpdate={handlePriceUpdate}
          toggleCarStatus={toggleCarStatus}
          darkMode={darkMode}
        />;
      case 'reservations':
        return <ReservationsComponent
          reservations={reservations}
          cars={cars}
          users={users}
          loading={loadingReservations}
          updateStatus={updateReservationStatus}
          handleDelete={handleDeleteReservation}
          darkMode={darkMode}
        />;
      case 'manage-users':
        return <UserManagementComponent
          users={users}
          userForm={userForm}
          handleUserChange={handleUserChange}
          handleUserSubmit={handleUserSubmit}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
          setUserForm={setUserForm}
          darkMode={darkMode}
        />;
      case 'dashboard':
      default:
        return <DashboardComponent
          cars={cars}
          reservations={reservations}
          users={users}
          darkMode={darkMode}
        />;
    }
  };

  return (
    <div className={`d-flex ${darkMode ? 'dark-mode' : ''}`} style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`${darkMode ? 'bg-dark' : 'bg-dark'} text-white ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
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
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-start text-white ${activeTab === 'reservations' ? 'active bg-primary' : ''}`}
              onClick={() => setActiveTab('reservations')}
            >
              <FaCalendarAlt className="me-2" />
              {!sidebarCollapsed && 'Reservations'}
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link btn btn-link text-start text-white ${activeTab === 'manage-users' ? 'active bg-primary' : ''}`}
              onClick={() => {
                setActiveTab('manage-users');
                setEditingUser(null);
                setUserForm({
                  name: '',
                  email: '',
                  role: 'user',
                  password: ''
                });
              }}
            >
              <FaUserCog className="me-2" />
              {!sidebarCollapsed && 'Manage Users'}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa' }}>
        {/* Top Navigation */}
        <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} shadow-sm`}>
          <div className="container-fluid">
            <span className="navbar-brand">Car Rental Admin</span>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary me-3"
                onClick={toggleDarkMode}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className={`container-fluid py-4 ${darkMode ? 'text-white' : ''}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Component with enhanced analytics
const DashboardComponent = ({ cars, reservations, users, darkMode }) => {
  const availableCars = cars.filter(car => car.status === 'available').length;
  const unavailableCars = cars.filter(car => car.status === 'unavailable').length;

  const reservationStatusCounts = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  const userRolesCount = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  // Calculate revenue from completed reservations
  const revenue = reservations
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => {
      const car = cars.find(c => c.id === r.car_id);
      if (car) {
        const days = (new Date(r.end_date) - new Date(r.start_date)) / (1000 * 60 * 60 * 24);
        return sum + (car.price * days);
      }
      return sum;
    }, 0);

  // Helper function to get user details by ID
  const getUserDetails = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  // Helper function to get car details by ID
  const getCarDetails = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model}` : 'Unknown Car';
  };

  return (
    <div className={darkMode ? 'text-white' : ''}>
      <h2>Dashboard Overview</h2>
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
            <div className="card-body">
              <h5 className="card-title">Total Cars</h5>
              <p className="card-text display-4">{cars.length}</p>
              <div className="d-flex justify-content-between">
                <small>Available: {availableCars}</small>
                <small>Unavailable: {unavailableCars}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-success text-white'}`}>
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-4">{users.length}</p>
              <div className="d-flex justify-content-between">
                <small>Admins: {userRolesCount.admin || 0}</small>
                <small>Clients: {userRolesCount.client || 0}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-info text-white'}`}>
            <div className="card-body">
              <h5 className="card-title">Reservations</h5>
              <p className="card-text display-4">{reservations.length}</p>
              <div className="d-flex justify-content-between">
                <small>Pending: {reservationStatusCounts.pending || 0}</small>
                <small>Active: {(reservationStatusCounts.approved || 0) + (reservationStatusCounts.pending || 0)}</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className={`card ${darkMode ? 'bg-secondary text-white' : 'bg-warning text-dark'}`}>
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <p className="card-text display-4">{revenue.toFixed(2)} DH</p>
              <small>From {reservationStatusCounts.completed || 0} completed reservations</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className={`card ${darkMode ? 'bg-dark' : 'bg-white'} shadow`}>
            <div className="card-header">
              <h5>Recent Reservations</h5>
            </div>
            <div className="card-body">
              {reservations.slice(0, 5).map(res => (
                <div key={res.id} className={`d-flex justify-content-between align-items-center mb-3 p-2 border-bottom ${darkMode ? 'border-secondary' : ''}`}>
                  <div>
                    <strong>{getUserDetails(res.user_id)}</strong>
                    <div className={`small ${darkMode ? 'text-light' : 'text-muted'}`}>{getCarDetails(res.car_id)}</div>
                  </div>
                  <span className={`badge ${res.status === 'approved' ? 'bg-success' :
                      res.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'
                    }`}>
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Management Component
const UserManagementComponent = ({
  users,
  userForm,
  handleUserChange,
  handleUserSubmit,
  handleEditUser,
  handleDeleteUser,
  editingUser,
  setEditingUser,
  setUserForm,
  darkMode
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={darkMode ? 'text-white' : ''}>
      <h2>User Management</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className={`card ${darkMode ? 'bg-dark' : ''}`}>
            <div className="card-body">
              <h5 className="card-title">{editingUser ? 'Edit User' : 'Add New User'}</h5>
              <form onSubmit={handleUserSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    name="name"
                    value={userForm.name}
                    onChange={handleUserChange}
                    required
                    className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={userForm.email}
                    onChange={handleUserChange}
                    required
                    className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                  />
                </div>
                
                {/* Added Password Field */}
                <div className="mb-3">
                  <label className="form-label">
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <div className="password-input-group">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={userForm.password}
                      onChange={handleUserChange}
                      className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                      minLength={editingUser ? undefined : 6}
                      placeholder={editingUser ? "••••••" : ""}
                    />
                    <span 
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {!editingUser && (
                    <small className={`form-text ${darkMode ? 'text-light' : 'text-muted'}`}>
                      Password must be at least 6 characters
                    </small>
                  )}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    name="role"
                    value={userForm.role}
                    onChange={handleUserChange}
                    className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                  >
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1">
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                  {editingUser && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEditingUser(null);
                        setUserForm({ name: '', email: '', role: 'client', password: '' });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className={`card ${darkMode ? 'bg-dark' : ''}`}>
            <div className="card-body">
              <div className="table-responsive">
                <table className={`table ${darkMode ? 'table-dark' : ''}`}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditUser(user)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Car Form Component
const CarFormComponent = ({ form, handleChange, handleSubmit, editingCar, message, error, darkMode }) => (
  <div className={darkMode ? 'text-white' : ''}>
    <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
    {message && <div className="alert alert-success">{message}</div>}
    {error && <div className="alert alert-danger">{error}</div>}
    <div className={`card ${darkMode ? 'bg-dark' : ''}`}>
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
                  className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Model</label>
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Year</label>
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
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
                  className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price (DH)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
                  type="number"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
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
              className={`form-control ${darkMode ? 'bg-secondary text-white' : ''}`}
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
const CarListComponent = ({ cars, loading, handleEdit, handleDelete, handlePriceUpdate, toggleCarStatus, darkMode }) => {
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
    <div className={darkMode ? 'text-white' : ''}>
      <h2>Manage Cars</h2>
      {loading ? (
        <div className="alert alert-info">Loading cars...</div>
      ) : (
        <div className={`card ${darkMode ? 'bg-dark' : ''}`}>
          <div className="card-body">
            <div className="table-responsive">
              <table className={`table ${darkMode ? 'table-dark' : ''}`}>
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
                              className={`form-control form-control-sm ${darkMode ? 'bg-secondary text-white' : ''}`}
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
                        <span className={`badge ${car.status === 'available' ? 'bg-success' : 'bg-danger'
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

// Reservations Component
const ReservationsComponent = ({ reservations, cars, users, loading, updateStatus, handleDelete, darkMode }) => {
  // Helper function to get car details by ID
  const getCarDetails = (carId) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.brand} ${car.model} (${car.year})` : 'Car not found';
  };

  // Helper function to get user details by ID
  const getUserDetails = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} (${user.email})` : 'User not found';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={darkMode ? 'text-white' : ''}>
      <h2>Manage Reservations</h2>
      {loading ? (
        <div className="alert alert-info">Loading reservations...</div>
      ) : (
        <div className={`card ${darkMode ? 'bg-dark' : ''}`}>
          <div className="card-body">
            <div className="table-responsive">
              <table className={`table ${darkMode ? 'table-dark' : ''}`}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Car</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(reservation => (
                    <tr key={reservation.id}>
                      <td>{getUserDetails(reservation.user_id)}</td>
                      <td>{getCarDetails(reservation.car_id)}</td>
                      <td>{formatDate(reservation.start_date)}</td>
                      <td>{formatDate(reservation.end_date)}</td>
                      <td>
                        <span className={`badge ${reservation.status === 'approved' ? 'bg-success' :
                            reservation.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'
                          }`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          {reservation.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => updateStatus(reservation.id, 'approved')}
                              >
                                <FaCheck /> Confirm
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => updateStatus(reservation.id, 'cancelled')}
                              >
                                <FaTimes /> Cancel
                              </button>
                            </>
                          )}
                          {reservation.status === 'approved' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateStatus(reservation.id, 'completed')}
                            >
                              Mark Completed
                            </button>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(reservation.id)}
                          >
                            <FaTrash />
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
