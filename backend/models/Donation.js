const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    donorEmail: {
      type: String,
      required: true,
    },
    donorPhone: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    state: String, // For analytics: which state is donor from
    razorpayPaymentId: String, // Razorpay payment ID
    razorpayOrderId: String,
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    receiptUrl: String, // URL of generated receipt
    certificateUrl: String, // URL of generated certificate
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);