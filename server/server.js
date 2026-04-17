const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const { initCronJobs } = require('./services/cronService');
initCronJobs();


const app = express();

// Trust proxy for Render deployment since it's behind a reverse proxy
app.set('trust proxy', 1);

// Middleware
// Set security HTTP headers
app.use(helmet());

// Enable CORS (Stricter for production, fallback to generic based on env if needed)
app.use(cors({
    origin: function (origin, callback) {
        callback(null, origin || true);
    },
    credentials: true
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // limit body size

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

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
const agentRoutes = require('./routes/agentRoutes');

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
app.use('/api/agent', agentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
