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
      enum: ['ngo', 'organization', 'donor'],
      required: true,
    },
    phone: {
      type: String,
      required: function() {
        return this.userType !== 'donor';
      },
    },
    organization: {
      type: String,
      required: function() {
        return this.userType !== 'donor';
      },
    },
    description: String,
    logo: String,
    website: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocs: [String],
    razorpayAccountId: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password BEFORE saving - IMPORTANT: use regular function, NOT arrow function
UserSchema.pre('save', function(next) {
  const user = this;

  // If password is not modified, continue
  if (!user.isModified('password')) {
    return next();
  }

  // Generate salt and hash password
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

// Method to compare password
UserSchema.methods.matchPassword = function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
