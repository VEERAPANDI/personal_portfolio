const express = require('express');
const router = express.Router();
const { Newsletter } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

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

        const newsletter = new Newsletter({ name, email, status: 'active' });
        await newsletter.save();

        res.status(201).json({ message: 'Successfully subscribed!', data: newsletter });
    } catch (error) {
        res.status(500).json({ message: 'Error subscribing to newsletter', error: error.message });
    }
});

// Public Unsubscribe route
router.get('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).send('Email is required for unsubscription');
        }

        const subscription = await Newsletter.findOneAndUpdate(
            { email },
            { 
                isActive: false, 
                status: 'unsubscribed',
                unsubscribedAt: new Date()
            },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).send('Subscription not found');
        }

        // Return a simple HTML page or redirect
        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #f8f9fa; height: 100vh;">
                <div style="background: white; padding: 40px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 20px; font-family: monospace; font-size: 24px; font-weight: bold;">
                        <span style="color: #007bff;">&lt;</span>vp<span style="color: #007bff;">/&gt;</span>
                    </div>
                    <h1 style="color: #333;">Unsubscribed Successfully</h1>
                    <p style="color: #666;">The email <strong>${email}</strong> has been removed from our list.</p>
                    <p style="color: #666;">We're sorry to see you go! You can resubscribe any time on our website.</p>
                    <a href="${process.env.CLIENT_URL || '#'}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Return to Website</a>
                </div>
            </div>
        `);
    } catch (error) {
        res.status(500).send('Error processing unsubscription: ' + error.message);
    }
});

// Get all subscriptions (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const subscriptions = await Newsletter.find().sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
    }
});

// Toggle active status
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
    try {
        const subscription = await Newsletter.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        subscription.isActive = !subscription.isActive;
        subscription.status = subscription.isActive ? 'active' : 'unsubscribed';
        if (subscription.status === 'unsubscribed') {
            subscription.unsubscribedAt = new Date();
        } else {
            subscription.unsubscribedAt = null;
        }
        await subscription.save();

        res.json({ message: 'Status updated', data: subscription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

// Delete subscription
router.delete('/:id', authMiddleware, async (req, res) => {
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

const { sendWeeklyNewsletter } = require('../services/emailService');

// Manual trigger for weekly newsletter (admin only)
router.post('/send-weekly', authMiddleware, async (req, res) => {
    try {
        const { watchTitle, watchLink, watchDescription } = req.body;
        
        const watchContent = watchLink ? {
            title: watchTitle,
            link: watchLink,
            description: watchDescription
        } : null;

        const result = await sendWeeklyNewsletter(watchContent);
        res.json({ message: 'Newsletter sending process completed', details: result });
    } catch (error) {
        res.status(500).json({ message: 'Error triggering newsletter', error: error.message });
    }
});

// Migration logic: Ensure all subscribers have a status field
const migrateNewsletterStatus = async () => {
    try {
        const result = await Newsletter.updateMany(
            { status: { $exists: false } },
            { $set: { status: 'active' } }
        );
        if (result.modifiedCount > 0) {
            console.log(`Migrated ${result.modifiedCount} newsletter subscribers to have default status.`);
        }
    } catch (err) {
        console.error('Migration Error:', err.message);
    }
};
migrateNewsletterStatus();

module.exports = router;


