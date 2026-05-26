const express = require('express');
const Product = require('../models/Product');
const Bid = require('../models/Bid');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/mine', protect, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch seller products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const bids = await Bid.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.json({ product, bids });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
});

// Finalize an auction (mark sold and create notification)
router.post('/:id/finalize', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const now = new Date();
    if (now <= new Date(product.auctionEndTime)) {
      return res.status(400).json({ message: 'Auction not ended yet' });
    }

    if (product.sold) {
      return res.json({ message: 'Already finalized', product });
    }

    // If there is a highest bidder, assign
    if (product.currentHighestBidderEmail) {
      // try to find user by email
      const winner = await require('../models/User').findOne({ email: product.currentHighestBidderEmail.toLowerCase() });
      if (winner) {
        product.winnerId = winner._id;
      }
      product.winnerName = product.currentHighestBidderName;
      product.winnerEmail = product.currentHighestBidderEmail;
      product.soldPrice = product.currentHighestBid;
      product.soldAt = now;
    }

    product.sold = true;
    await product.save();

    // Create notification for winner if exists
    if (product.winnerEmail) {
      const Notification = require('../models/Notification');
      await Notification.create({
        userEmail: product.winnerEmail,
        userId: product.winnerId,
        message: `You won the auction for ${product.title} at ₹${product.soldPrice}`,
        relatedProductId: product._id,
      });
    }

    res.json({ message: 'Auction finalized', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to finalize auction', error: error.message });
  }
});

router.post('/', protect, sellerOnly, async (req, res) => {
  try {
    const { title, description, imageUrl, startingBid, auctionEndTime } = req.body;

    if (!title || !description || !imageUrl || startingBid === undefined || !auctionEndTime) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    const parsedStartingBid = Number(startingBid);
    if (Number.isNaN(parsedStartingBid) || parsedStartingBid < 0) {
      return res.status(400).json({ message: 'Starting bid must be a valid number' });
    }

    const product = await Product.create({
      sellerId: req.user.id,
      sellerName: req.user.name,
      title,
      description,
      imageUrl,
      startingBid: parsedStartingBid,
      currentHighestBid: parsedStartingBid,
      currentHighestBidderName: '',
      currentHighestBidderEmail: '',
      auctionEndTime,
    });

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
});

router.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, sellerId: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Bid.deleteMany({ productId: req.params.id });
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
