const express = require('express');
const router = express.Router();
const { ResumeDownload } = require('../models');

// Track resume download
router.post('/track', async (req, res) => {
    try {
        const { source } = req.body;

        if (!source || !['hero', 'footer', 'agent'].includes(source)) {
            return res.status(400).json({ message: 'Valid source is required (hero, footer, or agent)' });
        }

        // Get IP address from request
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        const userAgent = req.headers['user-agent'];

        const download = new ResumeDownload({
            ipAddress,
            userAgent,
            source
        });

        await download.save();

        res.status(201).json({ message: 'Download tracked', data: download });
    } catch (error) {
        res.status(500).json({ message: 'Error tracking download', error: error.message });
    }
});

// Get all download records (admin only)
router.get('/downloads', async (req, res) => {
    try {
        const downloads = await ResumeDownload.find().sort({ createdAt: -1 });

        // Calculate statistics
        const stats = {
            total: downloads.length,
            bySource: {
                hero: downloads.filter(d => d.source === 'hero').length,
                footer: downloads.filter(d => d.source === 'footer').length,
                agent: downloads.filter(d => d.source === 'agent').length
            }
        };

        res.json({ downloads, stats });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching downloads', error: error.message });
    }
});

module.exports = router;
