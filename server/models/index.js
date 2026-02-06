const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
    icon: { type: String }, // URL or icon name
    category: { type: String } // Frontend, Backend, Tools
}, { timestamps: true });

const projectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    tags: [{ type: String }],
    link: { type: String },
    githubLink: { type: String }
}, { timestamps: true });

const experienceSchema = mongoose.Schema({
    company: { type: String, required: true },
    companyWebsite: { type: String },
    workingYear: { type: String }, // e.g., "Jan 2021 - Present"
    role: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // null means current
    description: { type: String },
    location: { type: String }
}, { timestamps: true });

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    visits: { type: Number, default: 0 },
    author: { type: String, default: 'Admin' },
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const newsletterSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const contactSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    repliedAt: { type: Date }
}, { timestamps: true });

const resumeDownloadSchema = mongoose.Schema({
    ipAddress: { type: String },
    userAgent: { type: String },
    source: { type: String, enum: ['hero', 'footer', 'agent'], required: true }
}, { timestamps: true });

module.exports = {
    Skill: mongoose.model('Skill', skillSchema),
    Project: mongoose.model('Project', projectSchema),
    Experience: mongoose.model('Experience', experienceSchema),
    Blog: mongoose.model('Blog', blogSchema),
    Message: mongoose.model('Message', messageSchema),
    Newsletter: mongoose.model('Newsletter', newsletterSchema),
    Contact: mongoose.model('Contact', contactSchema),
    ResumeDownload: mongoose.model('ResumeDownload', resumeDownloadSchema)
};
