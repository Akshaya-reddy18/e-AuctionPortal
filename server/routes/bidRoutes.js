const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const { protect } = require('../middleware/authMiddleware');

router.post('/:productId', protect, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ message: 'Only buyers can place bids' });
    }

    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const bidAmount = Number(req.body.amount);
    if (Number.isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: 'Bid amount must be a valid number' });
    }

    const now = new Date();
    if (now > new Date(product.auctionEndTime)) {
      return res.status(400).json({ message: 'Auction ended' });
    }

    if (bidAmount <= product.currentHighestBid) {
      return res.status(400).json({ message: 'Bid must be higher than current highest bid' });
    }

    const bid = await Bid.create({
      productId: product._id,
      bidderName: req.user.name,
      bidderEmail: req.user.email,
      amount: bidAmount,
    });

    product.currentHighestBid = bidAmount;
    product.currentHighestBidderName = req.user.name;
    product.currentHighestBidderEmail = req.user.email;
    await product.save();

    res.status(201).json({ message: 'Bid placed successfully', bid, product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place bid', error: error.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const bids = await Bid.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bid history' });
  }
});

module.exports = router;
