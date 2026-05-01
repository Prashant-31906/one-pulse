import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    targetAmount: '',
    imageUrl: '',
    story: '',
    urgencyLevel: 'medium',
    endDate: '',
  });

  // Redirect if not NGO/Organization
  if (user && user.userType === 'donor') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="card-large text-center">
          <h2 className="text-3xl font-bold text-dark mb-4">❌ Access Denied</h2>
          <p className="text-gray-600 mb-6">Only NGO/Organizations can create campaigns</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/campaigns', formData);
      setSuccess('✅ Campaign created successfully!');
      setTimeout(() => {
        navigate(`/campaigns/${response.data.campaign._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-dark mb-2 text-center">🎯 Create Campaign</h1>
        <p className="text-center text-gray-600 mb-8">Share your cause and make a difference</p>

        {error && <div className="error-message mb-6">{error}</div>}
        {success && <div className="success-message mb-6">{success}</div>}

        <div className="card-large">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Campaign Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Build a School in Rural Area"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="education">🎓 Education</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="disaster">🚨 Disaster Relief</option>
                <option value="environment">🌍 Environment</option>
                <option value="community">👥 Community</option>
                <option value="other">📌 Other</option>
              </select>
            </div>

            {/* Short Description */}
            <div className="form-group">
              <label className="form-label">Short Description *</label>
              <textarea
                name="description"
                placeholder="Brief overview of your campaign (max 500 chars)"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="3"
                maxLength="500"
                required
              />
            </div>

            {/* Detailed Story */}
            <div className="form-group">
              <label className="form-label">Detailed Story</label>
              <textarea
                name="story"
                placeholder="Tell the complete story... (max 5000 chars)"
                value={formData.story}
                onChange={handleChange}
                className="input-field"
                rows="6"
                maxLength="5000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Amount */}
              <div className="form-group">
                <label className="form-label">Target Amount (₹) *</label>
                <input
                  type="number"
                  name="targetAmount"
                  placeholder="e.g., 100000"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="input-field"
                  min="1000"
                  required
                />
              </div>

              {/* Urgency Level */}
              <div className="form-group">
                <label className="form-label">Urgency Level *</label>
                <select
                  name="urgencyLevel"
                  value={formData.urgencyLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                  <option value="critical">🚨 Critical</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="form-group">
                <label className="form-label">Campaign Image URL *</label>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              {/* End Date */}
              <div className="form-group">
                <label className="form-label">Campaign End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="form-group">
                <label className="form-label">Image Preview</label>
                <img
                  src={formData.imageUrl}
                  alt="Campaign preview"
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg"
            >
              {loading ? '⏳ Creating Campaign...' : '🚀 Create Campaign'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
