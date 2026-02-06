const express = require('express');
const router = express.Router();
const { Contact } = require('../models');

// Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }

        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        res.status(201).json({ message: 'Message sent successfully!', data: contact });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting contact form', error: error.message });
    }
});

// Get all contacts (admin only)
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
});

// Mark as read/unread
router.patch('/:id/read', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contact.isRead = !contact.isRead;
        await contact.save();

        res.json({ message: 'Status updated', data: contact });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
});

// Delete contact
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
});

module.exports = router;
