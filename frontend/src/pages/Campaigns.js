import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    category: '',
    status: 'active',
    search: '',
  });

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(filter).toString();
      const response = await api.get(`/campaigns?${query}`);
      setCampaigns(response.data.campaigns);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      education: '🎓',
      healthcare: '🏥',
      disaster: '🚨',
      environment: '🌍',
      community: '👥',
      other: '📌',
    };
    return icons[category] || '📌';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-dark mb-4 text-center">
            🎯 Browse Campaigns
          </h1>
          <p className="text-center text-gray-600 text-lg">
            Support causes you believe in
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="form-label">Search</label>
              <input
                type="text"
                name="search"
                placeholder="Search campaigns..."
                value={filter.search}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="education">🎓 Education</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="disaster">🚨 Disaster</option>
                <option value="environment">🌍 Environment</option>
                <option value="community">👥 Community</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="form-label">Status</label>
              <select
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="text-4xl">⏳</div>
            </div>
            <p className="text-gray-600 mt-4">Loading campaigns...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-message mb-8">
            {error}
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign) => (
              <Link
                key={campaign._id}
                to={`/campaigns/${campaign._id}`}
                className="card hover:shadow-xl transition-all"
              >
                {/* Image */}
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/400x300?text=Campaign')}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyColor(campaign.urgencyLevel)}`}>
                      {campaign.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  {/* Category & Title */}
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{getCategoryIcon(campaign.category)}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {campaign.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark mb-2 line-clamp-2">
                    {campaign.title}
                  </h3>

                  {/* Organizer */}
                  <p className="text-sm text-gray-600 mb-4">
                    {campaign.organizer?.organization || campaign.organizer?.name}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${calculateProgress(campaign.currentAmount, campaign.targetAmount)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>₹{(campaign.currentAmount / 100000).toFixed(1)}L</span>
                      <span>₹{(campaign.targetAmount / 100000).toFixed(1)}L</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>👥 {campaign.totalDonors} donors</span>
                    <span>👁️ {campaign.views} views</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Campaigns */}
        {!loading && campaigns.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-2xl mb-4">😔</p>
            <p className="text-gray-600 text-lg">No campaigns found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
