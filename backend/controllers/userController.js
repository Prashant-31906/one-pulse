const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, organization, description, website, logo } = req.body;

    let user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (organization) user.organization = organization;
    if (description) user.description = description;
    if (website) user.website = website;
    if (logo) user.logo = logo;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};