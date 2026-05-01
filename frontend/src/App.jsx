import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateCampaign from './pages/CreateCampaign';
import Campaigns from './pages/Campaigns';
import CampaignDetail from './pages/CampaignDetail';
import Receipt from './pages/Receipt';
import Certificate from './pages/Certificate';
import { AuthContext } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/receipt/:donationId" element={<Receipt />} />
          <Route path="/certificate/:donationId" element={<Certificate />} />

          {/* Protected Routes */}
          <Route
            path="/create-campaign"
            element={isAuthenticated ? <CreateCampaign /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
