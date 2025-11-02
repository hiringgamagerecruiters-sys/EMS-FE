import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info, Phone, LogIn } from 'lucide-react';
import Logo from '../../../assets/logo.png';

const TopNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 1, name: "Home", path: "/", icon: <Home className="w-5 h-5" /> },
    { id: 2, name: "About", path: "/about", icon: <Info className="w-5 h-5" /> },
    { id: 3, name: "Contact", path: "/contact", icon: <Phone className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#101820]/95 backdrop-blur-sm shadow-lg' : 'bg-[#101820]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <img 
              src={Logo} 
              alt="Gamage Recruiters Logo" 
              className="h-10 w-auto lg:h-12 transition-transform group-hover:scale-105" 
            />
            <span className="text-xl font-bold text-white hidden sm:inline-block">
              <span className="text-[#0097A7]">Gamage</span> Recruiters
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'text-[#0097A7]'
                        : 'text-white hover:text-[#0097A7]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ml-6">
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0097A7] text-white font-medium hover:bg-[#0097A7]/90 hover:shadow-lg hover:shadow-[#0097A7]/30 transition-all group"
              >
                <LogIn className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                <span className="font-semibold">Sign In</span>
                <span className="w-0 h-0.5 bg-white absolute bottom-1.5 right-6 group-hover:w-5 transition-all duration-300"></span>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#0097A7] focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#0097A7]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-[#101820]/95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={closeMenu}
            >
              <img 
                src={Logo} 
                alt="Gamage Recruiters Logo" 
                className="h-12 w-auto" 
              />
              <span className="text-xl font-bold text-white">
                <span className="text-[#0097A7]">Gamage</span> Recruiters
              </span>
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-white hover:text-[#0097A7] focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 text-lg font-medium px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-[#0097A7]/10 text-[#0097A7]'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={closeMenu}
                  >
                    {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0097A7] text-white font-medium hover:bg-[#0097A7]/90 hover:shadow-lg hover:shadow-[#0097A7]/30 transition-all group"
                onClick={closeMenu}
              >
                <LogIn className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" />
                <span className="font-semibold">Sign In</span>
                <span className="w-0 h-0.5 bg-white absolute bottom-2 right-6 group-hover:w-5 transition-all duration-300"></span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;