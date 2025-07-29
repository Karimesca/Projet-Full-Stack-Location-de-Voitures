import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { getUserById } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState(localStorage.getItem('name') || 'User');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // User data
  const userId = localStorage.getItem('user_id');
  const role = localStorage.getItem('user_role');
  const token = localStorage.getItem('token');

  const toggleNavbar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    ['user_id', 'user_role', 'name', 'token'].forEach(item => 
      localStorage.removeItem(item)
    );
    navigate('/login');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsCollapsed(true);
  }, [location]);

  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId || !token) {
        setName('User');
        return;
      }

      const storedName = localStorage.getItem('name');
      if (storedName) {
        setName(storedName);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getUserById(userId);
        if (response.data?.name) {
          setName(response.data.name);
          localStorage.setItem('name', response.data.name);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setName('User');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, [userId, token]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      document.querySelector('.navbar')?.classList.toggle('scrolled', scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayName = isLoading ? 'Loading...' : name;

  const navigationItems = [
    {
      to: '/cars',
      icon: 'fas fa-car-side',
      label: 'Cars',
      show: true
    },
    {
      to: '/my-reservations',
      icon: 'fas fa-calendar-check',
      label: 'My Reservations',
      show: userId && role !== 'admin'
    },
    {
      to: '/admin',
      icon: 'fas fa-tachometer-alt',
      label: 'Admin Dashboard',
      show: userId && role === 'admin'
    }
  ];

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/" aria-label="Azilal Wheels Home">
          <i className="fas fa-steering-wheel" aria-hidden="true"></i>
          Azilal Wheels
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-label="Toggle navigation"
          aria-expanded={!isCollapsed}
          aria-controls="navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div 
          className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            {navigationItems.map((item, index) => 
              item.show && (
                <li key={item.to} className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to={item.to}
                    onClick={() => setIsCollapsed(true)}
                  >
                    <i className={`${item.icon} me-2`} aria-hidden="true"></i>
                    {item.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!userId ? (
              <>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to="/login"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <i className="fas fa-sign-in-alt me-2" aria-hidden="true"></i>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    to="/register"
                    onClick={() => setIsCollapsed(true)}
                  >
                    <i className="fas fa-user-plus me-2" aria-hidden="true"></i>
                    Register
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
                  aria-haspopup="true"
                  disabled={isLoading}
                >
                  <i className="fas fa-user-circle me-2" aria-hidden="true"></i>
                  {displayName}
                  {isLoading && (
                    <div className="spinner-border spinner-border-sm ms-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li>
                    <span className="dropdown-item-text">
                      <i className="fas fa-user me-2" aria-hidden="true"></i>
                      {displayName}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <NavLink 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsCollapsed(true)}
                    >
                      <i className="fas fa-user-edit me-2" aria-hidden="true"></i>
                      Edit Profile
                    </NavLink>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                      aria-label="Logout from account"
                    >
                      <i className="fas fa-sign-out-alt me-2" aria-hidden="true"></i>
                      Logout
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