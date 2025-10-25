import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLight, setActiveLight] = useState(0);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lightInterval = setInterval(() => {
      setActiveLight((prev) => (prev + 1) % 3);
    }, 1000);

    return () => clearInterval(lightInterval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : 'header-top'}`}>
      <div className="header-container">
        <div className="header-main">
          <div className="header-left">
            <div className="racing-lights">
              <div className="light-column">
                <div className={`light light-red ${activeLight === 0 ? 'active' : ''}`}></div>
                <div className={`light light-red ${activeLight === 0 ? 'active' : ''}`}></div>
              </div>
              <div className="light-column">
                <div className={`light light-yellow ${activeLight === 1 ? 'active' : ''}`}></div>
                <div className={`light light-yellow ${activeLight === 1 ? 'active' : ''}`}></div>
              </div>
              <div className="light-column">
                <div className={`light light-green ${activeLight === 2 ? 'active' : ''}`}></div>
                <div className={`light light-green ${activeLight === 2 ? 'active' : ''}`}></div>
              </div>
            </div>
            <Link to="/" className="logo-link" onClick={scrollToTop}>
              <img src="/images/logo.png" alt="Speedway 146 Logo" className="logo-image" />
              <span className="logo-text">Speedway 146</span>
            </Link>
          </div>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={scrollToTop}
                className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="user-section">
            {user ? (
              <div className="user-menu-wrapper">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="user-button"
                >
                  <User className="h-5 w-5" />
                  <span className="user-email">{user.email}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-menu">
                    <button onClick={handleSignOut} className="user-menu-item">
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="auth-link">Sign In</Link>
                <Link to="/signup" className="signup-button">Sign Up</Link>
              </div>
            )}
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'mobile-menu-open' : ''}`}>
          <nav className="mobile-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'mobile-nav-link-active' : ''}`}
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mobile-auth">
            {user ? (
              <div className="mobile-auth-user">
                <div className="mobile-auth-email">{user.email}</div>
                <button onClick={handleSignOut} className="mobile-signout-button">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="mobile-auth-links">
                <Link to="/login" className="mobile-signin-link" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="mobile-signup-button" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
