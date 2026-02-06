const mongoose = require('mongoose');
const { Skill, Project, Experience, Blog, Message } = require('../models');

const factory = (Model) => ({
    getAll: async (req, res) => {
        try {
            const docs = await Model.find().sort({ createdAt: -1 });
            res.json(docs);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const doc = new Model(req.body);
            const savedDoc = await doc.save();
            res.status(201).json(savedDoc);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(doc);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            await Model.findByIdAndDelete(req.params.id);
            res.json({ message: 'Deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const doc = await Model.findById(req.params.id);
            if (!doc) return res.status(404).json({ message: 'Not Found' });
            res.json(doc);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
});

const blogController = {
    ...factory(Blog),
    getAll: async (req, res) => {
        try {
            const query = req.query.admin === 'true' ? {} : { isPublished: true };
            const docs = await Blog.find(query).sort({ createdAt: -1 });
            res.json(docs);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const isMongoId = mongoose.Types.ObjectId.isValid(id);
            const query = isMongoId ? { _id: id } : { slug: id };

            // For non-admin, ensure it's published
            if (req.query.admin !== 'true') {
                query.isPublished = true;
            }

            const doc = await Blog.findOneAndUpdate(
                query,
                { $inc: { visits: 1 } },
                { new: true }
            );
            if (!doc) return res.status(404).json({ message: 'Not Found' });
            res.json(doc);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = {
    skills: factory(Skill),
    projects: factory(Project),
    experience: {
        ...factory(Experience),
        getAll: async (req, res) => {
            try {
                const docs = await Experience.find().sort({ startDate: -1 });
                res.json(docs);
            } catch (err) {
                res.status(500).json({ message: err.message });
            }
        }
    },
    blogs: blogController,
    messages: factory(Message)
};
