const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Placeholders for now)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
const { skillRoutes, projectRoutes, experienceRoutes, blogRoutes, messageRoutes } = require('./routes');
const adminRoutes = require('./routes/adminRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const contactRoutes = require('./routes/contactRoutes');
const resumeRoutes = require('./routes/resumeRoutes');

app.use('/', sitemapRoutes); // Root level for /sitemap.xml
app.use('/api/admin', adminRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
