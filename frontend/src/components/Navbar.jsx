import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('name') || 'User');
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Get user info from localStorage
  const userId = localStorage.getItem('user_id');
  const role = localStorage.getItem('user_role');

  // Add the missing toggleNavbar function
  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch user name from API if logged in
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId || userId === 'undefined' || userId === 'null') {
        return;
      }

      try {
        const response = await getUserById(userId);
        if (response.data && response.data.name) {
          setName(response.data.name);
          localStorage.setItem('name', response.data.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (!localStorage.getItem('name')) {
          setName('User');
        }
      }
    };

    if (!localStorage.getItem('name')) {
      fetchUserName();
    }
  }, [userId]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand fw-bold" to="/">
          <i className="fas fa-car me-2"></i>CarRental
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/cars">
                <i className="fas fa-car-side me-1"></i> Cars
              </NavLink>
            </li>

            {userId && role !== 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/my-reservations">
                  <i className="fas fa-calendar-check me-1"></i> My Reservations
                </NavLink>
              </li>
            )}

            {userId && role === 'admin' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  <i className="fas fa-tachometer-alt me-1"></i> Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!userId ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    <i className="fas fa-sign-in-alt me-1"></i> Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    <i className="fas fa-user-plus me-1"></i> Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-2"></i>
                  {name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text fw-bold">
                      <i className="fas fa-user me-2"></i>{name}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink to="/profile" className="dropdown-item">
                      <i className="fas fa-user-edit me-2"></i>Edit Profile
                    </NavLink>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;