const express = require('express');
const router = express.Router();
const { Newsletter } = require('../models');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if email already exists
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        const newsletter = new Newsletter({ name, email });
        await newsletter.save();

        res.status(201).json({ message: 'Successfully subscribed!', data: newsletter });
    } catch (error) {
        res.status(500).json({ message: 'Error subscribing to newsletter', error: error.message });
    }
});

// Get all subscriptions (admin only)
router.get('/', async (req, res) => {
    try {
        const subscriptions = await Newsletter.find().sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Toggle active status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const subscription = await Newsletter.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        subscription.isActive = !subscription.isActive;
        await subscription.save();

        res.json({ message: 'Status updated', data: subscription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

// Delete subscription
router.delete('/:id', async (req, res) => {
    try {
        const subscription = await Newsletter.findByIdAndDelete(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.json({ message: 'Subscription deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription', error: error.message });
    }
});

module.exports = router;
