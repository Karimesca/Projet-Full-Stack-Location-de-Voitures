import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserById } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(localStorage.getItem('name') || 'User');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
      document.querySelector('.navbar')?.classList.toggle(
        'scrolled', 
        window.scrollY > 50
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const displayName = isLoading ? 'Loading...' : name;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <i className="fas fa-car me-2"></i>Azilal Wheels
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
                  {displayName}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <span className="dropdown-item-text">
                      <i className="fas fa-user me-2"></i>{displayName}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
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