import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error: contextError } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setSuccessMessage('⏳ Logging in...');
      const response = await login(formData.email, formData.password);
      setSuccessMessage('✅ ' + response.message);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.response?.data?.message || 'Login failed. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center p-4">
      <div className="card-large w-full max-w-md">
        <h2 className="text-4xl font-bold text-dark text-center mb-2">
          👋 Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Login to your OnePulse account
        </p>

        {contextError && <div className="error-message">⚠️ {contextError}</div>}
        {localError && <div className="error-message">❌ {localError}</div>}
        {successMessage && <div className="success-message">✅ {successMessage}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${validationErrors.email ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">❌ {validationErrors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${validationErrors.password ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">❌ {validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-8 text-lg"
          >
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-300">
          <p className="text-center text-sm text-gray-600">
            ✅ Secure login • 🔒 Your data is safe
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
