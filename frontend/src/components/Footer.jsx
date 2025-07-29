import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);

  // Update year and handle visibility
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footer = document.querySelector('.footer');
    if (footer) {
      observer.observe(footer);
    }

    return () => {
      if (footer) {
        observer.unobserve(footer);
      }
    };
  }, []);

  // Check if user is logged in
  const userId = localStorage.getItem('user_id');
  const userRole = localStorage.getItem('user_role');

  const socialMedia = [
    {
      name: 'Facebook',
      icon: 'fab fa-facebook-f',
      url: 'https://facebook.com',
      ariaLabel: 'Visit our Facebook page'
    },
    {
      name: 'Twitter', 
      icon: 'fab fa-twitter',
      url: 'https://twitter.com',
      ariaLabel: 'Follow us on Twitter'
    },
    {
      name: 'Instagram',
      icon: 'fab fa-instagram', 
      url: 'https://instagram.com',
      ariaLabel: 'Follow us on Instagram'
    },
    {
      name: 'LinkedIn',
      icon: 'fab fa-linkedin-in',
      url: 'https://linkedin.com',
      ariaLabel: 'Connect with us on LinkedIn'
    }
  ];

  const quickLinks = [
    { to: '/cars', label: 'Browse Cars', icon: 'fas fa-car' },
    ...(userId ? [
      { to: '/my-reservations', label: 'My Reservations', icon: 'fas fa-calendar-check' },
      { to: '/profile', label: 'Edit Profile', icon: 'fas fa-user-edit' }
    ] : [])
  ];

  const accountLinks = userId ? [
    { to: '/profile', label: 'Profile Settings', icon: 'fas fa-cog' },
    ...(userRole === 'admin' ? [
      { to: '/admin', label: 'Admin Dashboard', icon: 'fas fa-tachometer-alt' }
    ] : [])
  ] : [
    { to: '/login', label: 'Login', icon: 'fas fa-sign-in-alt' },
    { to: '/register', label: 'Register', icon: 'fas fa-user-plus' }
  ];

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      text: 'info@azilalwheels.com',
      href: 'mailto:info@azilalwheels.com',
      ariaLabel: 'Send us an email'
    },
    {
      icon: 'fas fa-phone',
      text: '+212 706 820 419',
      href: 'tel:+212706820419',
      ariaLabel: 'Call us'
    },
    {
      icon: 'fas fa-map-marker-alt',
      text: 'Azilal, Morocco',
      href: 'https://maps.google.com/?q=Azilal,Morocco',
      ariaLabel: 'View our location on map'
    }
  ];

  const handleSocialClick = (url, name) => {
    // Analytics tracking could be added here
    console.log(`Clicked ${name} social link`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`} role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link 
              to="/" 
              className="footer-logo"
              aria-label="Azilal Wheels - Return to homepage"
            >
              <i className="fas fa-steering-wheel" aria-hidden="true"></i>
              Azilal Wheels
            </Link>
            <p className="footer-slogan">
              Your premium car rental experience begins with us. Discover comfort, reliability, and excellence on every journey.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h5>Quick Links</h5>
              <ul role="list">
                {quickLinks.map((link, index) => (
                  <li key={index} role="listitem">
                    <Link 
                      to={link.to}
                      aria-label={`Navigate to ${link.label}`}
                    >
                      <i className={`${link.icon} me-2`} aria-hidden="true"></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>{userId ? 'Account' : 'Get Started'}</h5>
              <ul role="list">
                {accountLinks.map((link, index) => (
                  <li key={index} role="listitem">
                    <Link 
                      to={link.to}
                      aria-label={`Navigate to ${link.label}`}
                    >
                      <i className={`${link.icon} me-2`} aria-hidden="true"></i>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Connect With Us</h5>
              <div className="social-links" role="list" aria-label="Social media links">
                {socialMedia.map((social, index) => (
                  <button
                    key={index}
                    onClick={() => handleSocialClick(social.url, social.name)}
                    aria-label={social.ariaLabel}
                    className="social-link-btn"
                    type="button"
                  >
                    <i className={social.icon} aria-hidden="true"></i>
                  </button>
                ))}
              </div>
              
              <div className="contact-info">
                <h6 className="contact-title">Contact Information</h6>
                {contactInfo.map((contact, index) => (
                  <p key={index}>
                    <a 
                      href={contact.href}
                      aria-label={contact.ariaLabel}
                      target={contact.href.startsWith('http') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      <i className={contact.icon} aria-hidden="true"></i>
                      {contact.text}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            &copy; {currentYear} Azilal Wheels. All rights reserved. | 
            <Link to="/privacy" className="footer-legal-link"> Privacy Policy</Link> | 
            <Link to="/terms" className="footer-legal-link"> Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;