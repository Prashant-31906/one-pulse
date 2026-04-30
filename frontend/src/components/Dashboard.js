import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Card */}
        <div className="card-large bg-gradient-to-r from-primary to-secondary text-white mb-8">
          <h2 className="text-4xl font-bold mb-2">Welcome, {user.name}! 👋</h2>
          <p className="text-blue-100">Manage your campaigns and make a difference</p>
        </div>

        {/* Profile Section */}
        <div className="card mb-8">
          <h3 className="section-title">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-semibold text-dark">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Account Type</p>
              <p className="text-lg font-semibold text-primary uppercase">{user.userType}</p>
            </div>
            {user.organization && (
              <div>
                <p className="text-gray-600 text-sm">Organization</p>
                <p className="text-lg font-semibold text-dark">{user.organization}</p>
              </div>
            )}
            {user.phone && (
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="text-lg font-semibold text-dark">{user.phone}</p>
              </div>
            )}
            {user.isVerified !== undefined && (
              <div>
                <p className="text-gray-600 text-sm">Verification Status</p>
                <p className={`text-lg font-semibold ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* NGO/Organization Section */}
        {user.userType !== 'donor' && (
          <div className="card mb-8">
            <h3 className="section-title">Organization Dashboard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="btn-primary w-full text-left">
                ➕ Create Campaign
              </button>
              <button className="btn-secondary w-full text-left">
                📊 View Campaigns
              </button>
              <button className="btn-secondary w-full text-left">
                📈 Analytics
              </button>
            </div>
          </div>
        )}

        {/* Donor Section */}
        {user.userType === 'donor' && (
          <div className="card">
            <h3 className="section-title">Browse Campaigns</h3>
            <p className="text-gray-600 mb-6">
              Explore and support campaigns that matter to you
            </p>
            <button className="btn-primary">
              🌍 View Active Campaigns
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;