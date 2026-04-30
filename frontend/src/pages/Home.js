import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">
            🎯 Welcome to OnePulse
          </h1>
          <p className="text-xl text-blue-100 mb-10">
            A unified platform for fundraising and donations
          </p>

          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-large btn-primary bg-white text-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn-large btn-secondary border-2 border-white text-white">
                Login
              </Link>
            </div>
          ) : (
            <Link to="/dashboard" className="inline-block btn-large btn-primary bg-white text-primary">
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-dark mb-12">
            Why Choose OnePulse?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold text-dark mb-3">
                For NGO/Organizations
              </h3>
              <p className="text-gray-600">
                Create campaigns, track donations, and manage fundraising all in one place
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-dark mb-3">
                For Donors
              </h3>
              <p className="text-gray-600">
                Support causes you believe in with secure and transparent payments
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-dark mb-3">
                Analytics & Tracking
              </h3>
              <p className="text-gray-600">
                Get detailed insights and reports of your campaigns in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of organizations and donors making a difference
          </p>
          {!user && (
            <Link to="/register" className="btn-large bg-white text-primary">
              Start Now
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;