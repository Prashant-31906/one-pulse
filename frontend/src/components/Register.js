import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'ngo',
    phone: '',
    organization: '',
    description: '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Name, email, and password are required');
      return;
    }

    if (formData.userType !== 'donor') {
      if (!formData.phone || !formData.organization) {
        setLocalError('Phone and organization are required for NGO/Organization');
        return;
      }
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-500 to-secondary flex items-center justify-center p-4">
      <div className="card-large w-full max-w-md">
        <h2 className="text-3xl font-bold text-dark text-center mb-8">
          Register for OnePulse
        </h2>

        {error && <div className="error-message">{error}</div>}
        {localError && <div className="error-message">{localError}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* User Type */}
          <div className="form-group">
            <label className="form-label">Account Type *</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="input-field"
            >
              <option value="ngo">NGO</option>
              <option value="organization">Organization</option>
              <option value="donor">Donor</option>
            </select>
          </div>

          {/* Conditional Fields */}
          {formData.userType !== 'donor' && (
            <>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  required={formData.userType !== 'donor'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Name of your NGO/Organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="input-field"
                  required={formData.userType !== 'donor'}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  placeholder="About your organization..."
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  rows="4"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;