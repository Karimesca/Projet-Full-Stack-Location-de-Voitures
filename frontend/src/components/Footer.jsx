import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <i className="fas fa-car"></i> Azilal Wheels
            </Link>
            <p className="footer-slogan">
              Your journey begins with us
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h5>Quick Links</h5>
              <ul>
                <li><Link to="/cars">Browse Cars</Link></li>
                <li><Link to="/my-reservations">My Reservations</Link></li>
                <li><Link to="/profile">Edit Profile</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Account</h5>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Contact-us :</h5>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
              <div className="contact-info">
                <p><i className="fas fa-envelope"></i> info@carrental.com</p>
                <p><i className="fas fa-phone"></i> +212 706820419</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CarRental. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;