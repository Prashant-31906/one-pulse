const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide campaign title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide campaign description'],
    },
    category: {
      type: String,
      enum: ['medical', 'education', 'disaster', 'food', 'shelter', 'other'],
      required: true,
    },
    images: [String], // URLs of campaign images (Cloudinary/S3)
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide target amount'],
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'paused'],
      default: 'active',
    },
    razorpayOrderPrefix: String, // For tracking payments
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', CampaignSchema);