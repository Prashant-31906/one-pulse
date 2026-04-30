const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    userType: {
      type: String,
      enum: ['ngo', 'organization', 'donor'], // ngo, organization, or donor
      required: true,
    },
    phone: {
      type: String,
      required: function() {
        return this.userType !== 'donor';
      }, // Optional for donors, required for NGO/Org
    },
    organization: {
      type: String,
      required: function() {
        return this.userType !== 'donor';
      }, // Name of NGO/Organization
    },
    description: String, // About the NGO/Organization
    logo: String, // URL of organization logo (Cloudinary/S3)
    website: String,
    isVerified: {
      type: Boolean,
      default: false, // NGO/Org needs verification
    },
    verificationDocs: [String], // URLs of verification documents
    razorpayAccountId: String, // For NGO/Org: Razorpay Account ID
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);