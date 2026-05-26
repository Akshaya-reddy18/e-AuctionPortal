const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
      min: 0,
    },
    currentHighestBid: {
      type: Number,
      required: true,
      default: 0,
    },
    currentHighestBidderName: {
      type: String,
      default: '',
    },
    currentHighestBidderEmail: {
      type: String,
      default: '',
    },
    auctionEndTime: {
      type: Date,
      required: true,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    winnerName: {
      type: String,
    },
    winnerEmail: {
      type: String,
    },
    soldPrice: {
      type: Number,
    },
    soldAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
