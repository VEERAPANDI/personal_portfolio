const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Skill, Project, Experience, Blog } = require('./models');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        await Skill.deleteMany({});
        await Project.deleteMany({});
        await Experience.deleteMany({});
        await Blog.deleteMany({});

        await Skill.insertMany([
            { name: 'React', level: 'Expert', icon: 'Code' },
            { name: 'Node.js', level: 'Advanced', icon: 'Server' },
            { name: 'MongoDB', level: 'Intermediate', icon: 'Database' },
            { name: 'Python', level: 'Advanced', icon: 'Terminal' }
        ]);

        await Project.insertMany([
            {
                title: 'E-Commerce Platform',
                description: 'A modern e-commerce solution with real-time inventory and AI recommendations.',
                link: 'https://example.com',
                image: 'https://via.placeholder.com/600x400'
            },
            {
                title: 'Financial Dashboard',
                description: 'High-performance dashboard for visualizing complex financial data.',
                link: 'https://example.com',
                image: 'https://via.placeholder.com/600x400'
            },
            {
                title: 'Social Network App',
                description: 'A community-driven platform connecting creators worldwide.',
                link: 'https://example.com',
                image: 'https://via.placeholder.com/600x400'
            }
        ]);

        await Blog.insertMany([
            {
                title: 'The Future of AI in Web Development',
                slug: 'future-of-ai',
                excerpt: 'How artificial intelligence is reshaping the way we build and interact with the web.',
                content: 'Full content...',
                tags: ['AI', 'Web Dev']
            },
            {
                title: 'Mastering React 18',
                slug: 'mastering-react-18',
                excerpt: 'A deep dive into the new features of React 18.',
                content: 'Full content...',
                tags: ['React']
            }
        ]);

        console.log('Data Seeded!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
