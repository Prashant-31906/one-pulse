import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationData, setDonationData] = useState({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    message: '',
    isAnonymous: false,
  });

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaignRes = await api.get(`/campaigns/${id}`);
      const statsRes = await api.get(`/campaigns/${id}/stats`);
      setCampaign(campaignRes.data.campaign);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDonationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDonate = async (e) => {
    e.preventDefault();

    try {
      if (!donationData.amount || parseInt(donationData.amount) < 100) {
        alert('Minimum donation is ₹100');
        return;
      }

      // Create order
      const orderRes = await api.post('/donations/create-order', {
        campaignId: id,
        amount: parseInt(donationData.amount),
      });

      // Open Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: donationRes.data.order.amount,
        currency: 'INR',
        order_id: orderRes.data.order.id,
        name: 'OnePulse',
        description: campaign.title,
        handler: function(response) {
          verifyPayment(response);
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  const verifyPayment = async (response) => {
    try {
      const res = await api.post('/donations/verify', {
        ...response,
        ...donationData,
        campaignId: id,
      });

      alert('✅ Donation successful! Thank you!');
      setShowDonateModal(false);
      fetchCampaignDetails();
    } catch (err) {
      alert('❌ Payment verification failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center card-large">
          <p className="text-2xl mb-4">😔</p>
          <p className="text-red-600">{error || 'Campaign not found'}</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="btn-primary mt-6"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = stats?.percentageRaised || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Campaign Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title & Category */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-4xl mr-3">
                  {campaign.category === 'education' && '🎓'}
                  {campaign.category === 'healthcare' && '🏥'}
                  {campaign.category === 'disaster' && '🚨'}
                  {campaign.category === 'environment' && '🌍'}
                  {campaign.category === 'community' && '👥'}
                </span>
                <h1 className="text-4xl font-bold text-dark inline">{campaign.title}</h1>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold
                ${campaign.urgencyLevel === 'critical' && 'bg-red-100 text-red-800'}
                ${campaign.urgencyLevel === 'high' && 'bg-orange-100 text-orange-800'}
                ${campaign.urgencyLevel === 'medium' && 'bg-yellow-100 text-yellow-800'}
                ${campaign.urgencyLevel === 'low' && 'bg-green-100 text-green-800'}
              `}>
                {campaign.urgencyLevel.toUpperCase()}
              </span>
            </div>

            {/* Organizer */}
            <div className="flex items-center mb-6 pb-6 border-b">
              <div className="w-12 h-12 bg-primary rounded-full mr-4"></div>
              <div>
                <p className="font-bold text-dark">{campaign.organizer?.organization}</p>
                <p className="text-gray-600 text-sm">by {campaign.organizer?.name}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-dark mb-4">About This Campaign</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
            </div>

            {/* Story */}
            {campaign.story && (
              <div className="mb-8 bg-white p-6 rounded-lg">
                <h3 className="text-xl font-bold text-dark mb-4">📖 The Story</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{campaign.story}</p>
              </div>
            )}

            {/* Updates */}
            {campaign.updates && campaign.updates.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-dark mb-4">📢 Campaign Updates</h3>
                <div className="space-y-4">
                  {campaign.updates.map((update, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-dark">{update.title}</h4>
                        <span className="text-sm text-gray-600">
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{update.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Donors */}
            {campaign.donors && campaign.donors.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-dark mb-4">❤️ Recent Supporters</h3>
                <div className="space-y-3">
                  {campaign.donors.slice(0, 5).map((donation, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-lg">
                      <div>
                        <p className="font-semibold">
                          {donation.isAnonymous ? '🔒 Anonymous Donor' : donation.donorName}
                        </p>
                        {donation.message && (
                          <p className="text-sm text-gray-600">"{donation.message}"</p>
                        )}
                      </div>
                      <span className="font-bold text-primary">₹{donation.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Donation Card */}
          <div className="lg:col-span-1">
            <div className="card-large sticky top-20">
              {/* Progress */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary mb-2">
                  ₹{(campaign.currentAmount).toLocaleString()}
                </div>
                <p className="text-gray-600 mb-4">
                  raised of ₹{campaign.targetAmount.toLocaleString()}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-primary h-3 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm font-bold text-primary">
                  {Math.round(progressPercentage)}% funded
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{stats?.totalDonors || 0}</p>
                  <p className="text-xs text-gray-600">Donors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-dark">{stats?.daysLeft || 0}</p>
                  <p className="text-xs text-gray-600">Days Left</p>
                </div>
              </div>

              {/* Donate Button */}
              <button
                onClick={() => setShowDonateModal(true)}
                className="btn-primary w-full text-lg mb-4"
              >
                💝 Donate Now
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="btn-secondary w-full"
              >
                📤 Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      {showDonateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card-large w-full max-w-md">
            <h2 className="text-2xl font-bold text-dark mb-6">💝 Make a Donation</h2>

            <form onSubmit={handleDonate} className="space-y-4">
              {/* Amount */}
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="Minimum ₹100"
                  value={donationData.amount}
                  onChange={handleDonationChange}
                  className="input-field"
                  min="100"
                  required
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={donationData.isAnonymous}
                  onChange={handleDonationChange}
                  className="mr-3 w-5 h-5 cursor-pointer"
                />
                <label className="cursor-pointer">
                  🔒 Keep my donation anonymous
                </label>
              </div>

              {/* Name */}
              {!donationData.isAnonymous && (
                <>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      name="donorName"
                      placeholder="Your name"
                      value={donationData.donorName}
                      onChange={handleDonationChange}
                      className="input-field"
                      required={!donationData.isAnonymous}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="donorEmail"
                      placeholder="your@email.com"
                      value={donationData.donorEmail}
                      onChange={handleDonationChange}
                      className="input-field"
                      required={!donationData.isAnonymous}
                    />
                  </div>
                </>
              )}

              {/* Message */}
              <div className="form-group">
                <label className="form-label">Message (Optional)</label>
                <textarea
                  name="message"
                  placeholder="Share why you're supporting this cause..."
                  value={donationData.message}
                  onChange={handleDonationChange}
                  className="input-field"
                  rows="3"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowDonateModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
