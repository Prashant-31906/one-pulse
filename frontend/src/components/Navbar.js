import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-primary to-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white text-2xl font-bold hover:opacity-80 transition">
            <span className="text-3xl">🎯</span>
            <span>OnePulse</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="text-white text-sm font-medium">
                  👤 {user.name} <span className="text-gray-200">({user.userType})</span>
                </div>
                {user.userType !== 'donor' && (
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-gray-200 font-medium transition"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="btn-danger !px-4 !py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary !px-4 !py-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;