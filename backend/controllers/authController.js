const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, userType, phone, organization, description } = req.body;

    console.log('📝 Registration Request:', { name, email, userType });

    // Validation
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'This email is already registered!' 
      });
    }

    // Validate NGO/Organization fields
    if (userType !== 'donor') {
      if (!phone || !organization) {
        return res.status(400).json({ 
          success: false,
          message: 'Phone and Organization name are required' 
        });
      }
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      userType,
      phone: userType !== 'donor' ? phone : undefined,
      organization: userType !== 'donor' ? organization : undefined,
      description: userType !== 'donor' ? description : undefined,
    });

    await user.save();
    console.log(`✅ New user registered: ${email} (${userType})`);

    // Generate token
    const token = generateToken(user._id, user.userType);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to OnePulse 🎉',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login Request:', { email });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide both email and password' 
      });
    }

    // Check user exists with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('❌ Password incorrect for:', email);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id, user.userType);
    console.log(`✅ User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back 👋',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        organization: user.organization,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
