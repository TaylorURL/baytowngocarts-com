import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLight, setActiveLight] = useState(0);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();

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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[var(--color-navy-900)] backdrop-blur-md shadow-2xl border-b border-[var(--color-red-900)]' 
          : 'bg-gradient-to-b from-[var(--color-navy-900)] to-transparent'
      }`}
      style={{
        boxShadow: isScrolled ? 'var(--shadow-red)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <div 
              className="flex gap-2 p-3 rounded-xl border backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(10, 25, 41, 0.8)',
                borderColor: 'var(--color-navy-700)'
              }}
            >
              <div className="flex flex-col gap-1.5">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLight === 0 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: activeLight === 0 ? 'var(--color-red-500)' : 'rgba(127, 29, 29, 0.3)',
                    border: activeLight === 0 ? 'none' : '1px solid var(--color-red-900)',
                    boxShadow: activeLight === 0 ? '0 0 20px rgba(239, 68, 68, 1)' : 'none'
                  }}
                ></div>
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLight === 0 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: activeLight === 0 ? 'var(--color-red-500)' : 'rgba(127, 29, 29, 0.3)',
                    border: activeLight === 0 ? 'none' : '1px solid var(--color-red-900)',
                    boxShadow: activeLight === 0 ? '0 0 20px rgba(239, 68, 68, 1)' : 'none'
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLight === 1 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: activeLight === 1 ? 'var(--color-yellow-400)' : 'rgba(161, 98, 7, 0.3)',
                    border: activeLight === 1 ? 'none' : '1px solid rgba(161, 98, 7, 0.5)',
                    boxShadow: activeLight === 1 ? '0 0 20px rgba(250, 204, 21, 1)' : 'none'
                  }}
                ></div>
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLight === 1 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: activeLight === 1 ? 'var(--color-yellow-400)' : 'rgba(161, 98, 7, 0.3)',
                    border: activeLight === 1 ? 'none' : '1px solid rgba(161, 98, 7, 0.5)',
                    boxShadow: activeLight === 1 ? '0 0 20px rgba(250, 204, 21, 1)' : 'none'
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLight === 2 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: activeLight === 2 ? 'var(--color-green-600)' : 'rgba(21, 128, 61, 0.3)',
                    border: activeLight === 2 ? 'none' : '1px solid var(--color-green-700)',
                    boxShadow: activeLight === 2 ? '0 0 20px rgba(22, 163, 74, 1)' : 'none'
                  }}
                ></div>
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${activeLight === 2 ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: activeLight === 2 ? 'var(--color-green-600)' : 'rgba(21, 128, 61, 0.3)',
                    border: activeLight === 2 ? 'none' : '1px solid var(--color-green-700)',
                    boxShadow: activeLight === 2 ? '0 0 20px rgba(22, 163, 74, 1)' : 'none'
                  }}
                ></div>
              </div>
            </div>
            <Link to="/" className="flex items-center gap-3 group" onClick={scrollToTop}>
              <img 
                src="/images/logo.png" 
                alt="Speedway 146 Logo" 
                className="h-14 w-14 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" 
                style={{ filter: 'drop-shadow(0 0 15px rgba(220, 38, 38, 0.5))' }}
              />
              <span 
                className="text-2xl font-black hidden sm:block bg-gradient-to-r bg-clip-text text-transparent group-hover:from-[var(--color-red-400)] group-hover:to-[var(--color-red-600)] transition-all duration-500"
                style={{
                  backgroundImage: 'linear-gradient(to right, var(--color-red-500), var(--color-red-600))'
                }}
              >
                Speedway 146
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={scrollToTop}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 relative ${
                  location.pathname === item.path ? '' : ''
                }`}
                style={{
                  color: location.pathname === item.path ? 'var(--color-red-500)' : 'var(--color-gray-300)',
                  backgroundColor: location.pathname === item.path ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                  border: location.pathname === item.path ? '1px solid var(--color-red-800)' : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'var(--color-white)';
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.15)';
                    e.currentTarget.style.borderColor = 'var(--color-red-900)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.color = 'var(--color-gray-300)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/cart"
              className="relative px-4 py-2.5 rounded-lg transition-all duration-300 border"
              style={{
                backgroundColor: 'var(--color-navy-800)',
                borderColor: 'var(--color-navy-600)',
                color: 'var(--color-white)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-navy-700)';
                e.currentTarget.style.borderColor = 'var(--color-red-700)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-navy-800)';
                e.currentTarget.style.borderColor = 'var(--color-navy-600)';
              }}
            >
              <ShoppingCart className="h-5 w-5" style={{ color: 'var(--color-red-500)' }} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-lg transition-all duration-300 border"
                  style={{
                    backgroundColor: 'var(--color-navy-800)',
                    borderColor: 'var(--color-navy-600)',
                    color: 'var(--color-white)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-700)';
                    e.currentTarget.style.borderColor = 'var(--color-red-700)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-800)';
                    e.currentTarget.style.borderColor = 'var(--color-navy-600)';
                  }}
                >
                  <User className="h-5 w-5" style={{ color: 'var(--color-red-500)' }} />
                  <span className="text-sm font-medium max-w-[150px] truncate">{user.email}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-56 rounded-lg shadow-2xl overflow-hidden border"
                    style={{
                      backgroundColor: 'var(--color-navy-800)',
                      borderColor: 'var(--color-navy-600)'
                    }}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all duration-300 border-l-4"
                      style={{
                        color: 'var(--color-gray-300)',
                        borderColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
                        e.currentTarget.style.color = 'var(--color-white)';
                        e.currentTarget.style.borderColor = 'var(--color-red-500)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-gray-300)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>My Purchases</span>
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm font-medium transition-all duration-300 border-l-4"
                      style={{
                        color: 'var(--color-gray-300)',
                        borderColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
                        e.currentTarget.style.color = 'var(--color-white)';
                        e.currentTarget.style.borderColor = 'var(--color-red-500)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--color-gray-300)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105"
                  style={{ color: 'var(--color-gray-300)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-white)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-gray-300)'}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-7 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 border"
                  style={{
                    backgroundColor: 'var(--color-red-600)',
                    color: 'var(--color-white)',
                    borderColor: 'var(--color-red-700)',
                    boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-red-500)';
                    e.currentTarget.style.boxShadow = '0 8px 20px 0 rgba(220, 38, 38, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-red-600)';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(220, 38, 38, 0.4)';
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            className="lg:hidden p-3 rounded-lg transition-all duration-300 border"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            style={{
              color: 'var(--color-white)',
              borderColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
              e.currentTarget.style.borderColor = 'var(--color-red-800)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
          <nav 
            className="py-4 space-y-2 rounded-2xl backdrop-blur-md border mt-4 p-4"
            style={{
              backgroundColor: 'rgba(10, 25, 41, 0.9)',
              borderColor: 'var(--color-navy-700)'
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-5 py-4 rounded-lg text-base font-bold transition-all duration-300 border"
                style={{
                  color: location.pathname === item.path ? 'var(--color-red-500)' : 'var(--color-gray-300)',
                  backgroundColor: location.pathname === item.path ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
                  borderColor: location.pathname === item.path ? 'var(--color-red-800)' : 'transparent'
                }}
                onClick={() => {
                  setIsMenuOpen(false);
                  scrollToTop();
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-800)';
                    e.currentTarget.style.color = 'var(--color-white)';
                    e.currentTarget.style.borderColor = 'var(--color-navy-600)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-gray-300)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div 
            className="py-4 mt-4 border-t"
            style={{ borderColor: 'var(--color-navy-700)' }}
          >
            {user ? (
              <div 
                className="space-y-4 rounded-2xl backdrop-blur-md border p-4"
                style={{
                  backgroundColor: 'rgba(10, 25, 41, 0.9)',
                  borderColor: 'var(--color-navy-700)'
                }}
              >
                <div 
                  className="px-5 py-3 text-sm truncate rounded-lg border font-medium"
                  style={{
                    color: 'var(--color-gray-400)',
                    backgroundColor: 'rgba(31, 41, 55, 0.5)',
                    borderColor: 'var(--color-navy-700)'
                  }}
                >
                  {user.email}
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg transition-all duration-300 font-bold border"
                  style={{
                    backgroundColor: 'var(--color-navy-900)',
                    color: 'var(--color-gray-300)',
                    borderColor: 'var(--color-navy-600)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
                    e.currentTarget.style.color = 'var(--color-white)';
                    e.currentTarget.style.borderColor = 'var(--color-red-800)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-900)';
                    e.currentTarget.style.color = 'var(--color-gray-300)';
                    e.currentTarget.style.borderColor = 'var(--color-navy-600)';
                  }}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>My Purchases</span>
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-lg transition-all duration-300 font-bold border"
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    color: 'var(--color-red-400)',
                    borderColor: 'var(--color-red-800)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.3)';
                    e.currentTarget.style.color = 'var(--color-red-300)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
                    e.currentTarget.style.color = 'var(--color-red-400)';
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 px-4">
                <Link 
                  to="/login" 
                  className="w-full text-center px-5 py-4 rounded-lg transition-all duration-300 font-bold border"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    color: 'var(--color-gray-300)',
                    borderColor: 'var(--color-navy-600)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-navy-800)';
                    e.currentTarget.style.color = 'var(--color-white)';
                    e.currentTarget.style.borderColor = 'var(--color-red-800)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-gray-300)';
                    e.currentTarget.style.borderColor = 'var(--color-navy-600)';
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="w-full text-center px-5 py-4 rounded-lg font-bold transition-all duration-300 border"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    backgroundColor: 'var(--color-red-600)',
                    color: 'var(--color-white)',
                    borderColor: 'var(--color-red-700)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-red-500)';
                    e.currentTarget.style.boxShadow = '0 8px 20px 0 rgba(220, 38, 38, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-red-600)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
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
