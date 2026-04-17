const express = require('express');
const router = express.Router();
const { Skill, Project, Experience, Blog, PersonalProject } = require('../models');

// Intent detection keywords mapped to categories
const INTENTS = {
    greeting: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy', 'greetings', 'sup', 'what\'s up'],
    skills: ['skill', 'stack', 'technology', 'tech', 'technologies', 'tools', 'language', 'framework', 'proficient', 'expertise', 'know', 'capable'],
    projects: ['project', 'portfolio', 'built', 'created', 'developed', 'app', 'application', 'website', 'product', 'showcase'],
    experience: ['experience', 'job', 'company', 'work history', 'career', 'role', 'position', 'employ', 'worked', 'working'],
    blogs: ['blog', 'article', 'post', 'write', 'writing', 'read', 'content', 'published'],
    contact: ['contact', 'email', 'hire', 'reach', 'connect', 'message', 'talk', 'call', 'phone', 'collaborate'],
    about: ['about', 'who', 'yourself', 'introduction', 'intro', 'tell me', 'describe', 'background', 'story'],
    resume: ['resume', 'cv', 'download cv', 'download resume', 'curriculum']
};

/**
 * Detect user intent from message text
 */
function detectIntent(message) {
    const lower = message.toLowerCase().trim();

    for (const [intent, keywords] of Object.entries(INTENTS)) {
        for (const keyword of keywords) {
            if (lower.includes(keyword)) {
                return intent;
            }
        }
    }
    return 'unknown';
}

/**
 * Format skills into a natural response
 */
function formatSkills(skills) {
    if (!skills.length) return { reply: "No skills data available yet. Check back soon!", type: 'text' };

    const grouped = {};
    skills.forEach(s => {
        const cat = s.category || 'General';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(s);
    });

    let reply = "Here are the technical skills and expertise:\n\n";
    for (const [category, items] of Object.entries(grouped)) {
        reply += `**${category}:** ${items.map(s => `${s.name} (${s.level})`).join(', ')}\n`;
    }

    return {
        reply,
        type: 'skills',
        data: skills.map(s => ({ name: s.name, level: s.level, category: s.category || 'General', icon: s.icon }))
    };
}

/**
 * Format projects into a natural response  
 */
function formatProjects(projects, personalProjects) {
    if (!projects.length && !personalProjects.length) return { reply: "No projects to showcase yet. Stay tuned!", type: 'text' };

    let reply = `Here are some featured projects:\n\n`;
    
    if (projects.length > 0) {
        reply += `**Job Achieved Projects:**\n`;
        projects.forEach((p, i) => {
            reply += `${i + 1}. **${p.title}** — ${p.description}\n`;
        });
        reply += `\n`;
    }

    if (personalProjects.length > 0) {
        reply += `**Personal GitHub Projects:**\n`;
        personalProjects.forEach((p, i) => {
            reply += `${i + 1}. **${p.title}** — ${p.description}\n`;
        });
    }

    // Combine for the Agent UI cards
    const combinedData = [];
    projects.forEach(p => combinedData.push({
        title: p.title + ' (Job Achieved)',
        description: p.description,
        image: p.image || p.featuredImage?.optimized_image_url,
        link: p.link,
        githubLink: p.githubLink,
        tags: p.tags
    }));
    personalProjects.forEach(p => combinedData.push({
        title: p.title + ' (Personal)',
        description: p.description,
        image: p.featuredImage?.optimized_image_url,
        link: p.homepage,
        githubLink: p.githubLink,
        tags: p.language ? [p.language] : []
    }));

    return {
        reply,
        type: 'projects',
        data: combinedData
    };
}

/**
 * Format experience into a natural response
 */
function formatExperience(experiences) {
    if (!experiences.length) return { reply: "Experience details are being updated. Check back soon!", type: 'text' };

    let reply = "Here's the professional journey:\n\n";
    experiences.forEach(e => {
        const period = e.workingYear || (e.endDate ? `${new Date(e.startDate).getFullYear()} - ${new Date(e.endDate).getFullYear()}` : `${new Date(e.startDate).getFullYear()} - Present`);
        reply += `**${e.role}** at ${e.company} (${period})\n`;
        if (e.description) reply += `↳ ${e.description}\n`;
        reply += '\n';
    });

    return {
        reply,
        type: 'experience',
        data: experiences.map(e => ({
            company: e.company,
            role: e.role,
            workingYear: e.workingYear,
            startDate: e.startDate,
            endDate: e.endDate,
            description: e.description,
            location: e.location
        }))
    };
}

/**
 * Format blogs into a natural response
 */
function formatBlogs(blogs) {
    if (!blogs.length) return { reply: "No blog posts published yet. Watch this space!", type: 'text' };

    let reply = `Here are the latest blog posts:\n\n`;
    blogs.forEach((b, i) => {
        const tags = b.tags && b.tags.length ? ` [${b.tags.join(', ')}]` : '';
        reply += `**${i + 1}. ${b.title}**${tags}\n↳ ${b.excerpt}\n\n`;
    });

    return {
        reply,
        type: 'blogs',
        data: blogs.map(b => ({
            title: b.title,
            slug: b.slug,
            excerpt: b.excerpt,
            tags: b.tags
        }))
    };
}

// POST /api/agent/chat
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ reply: "Please type a message to get started!", type: 'text' });
        }

        const intent = detectIntent(message);
        let response;

        switch (intent) {
            case 'greeting': {
                const greetings = [
                    "Hello! 👋 Welcome to my portfolio. I can tell you about my **skills**, **projects**, **experience**, or **blog posts**. What would you like to know?",
                    "Hey there! Great to have you here. Ask me anything about this portfolio — skills, projects, experience, or blogs!",
                    "Hi! 😊 I'm the AI assistant for this portfolio. I'd love to help you explore. What interests you?"
                ];
                response = { reply: greetings[Math.floor(Math.random() * greetings.length)], type: 'greeting' };
                break;
            }

            case 'skills': {
                const skills = await Skill.find().sort({ level: 1 });
                response = formatSkills(skills);
                break;
            }

            case 'projects': {
                const projects = await Project.find().sort({ createdAt: -1 });
                const personalProjects = await PersonalProject.find().sort({ createdAt: -1 });
                response = formatProjects(projects, personalProjects);
                break;
            }

            case 'experience': {
                const experiences = await Experience.find().sort({ startDate: -1 });
                response = formatExperience(experiences);
                break;
            }

            case 'blogs': {
                const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).limit(5);
                response = formatBlogs(blogs);
                break;
            }

            case 'contact': {
                response = {
                    reply: "I'd love to connect! Here's how you can reach out:\n\n📧 **Email:** Feel free to use the contact form on this site\n💼 **LinkedIn:** Check the footer for social links\n📝 **Message:** You can also send a direct message via the Contact section below\n\nLooking forward to hearing from you!",
                    type: 'contact'
                };
                break;
            }

            case 'about': {
                response = {
                    reply: "I'm **Veerapandi Lakshmanan**, a Senior Web Application Developer with **8+ years** of experience. I specialize in building scalable, AI-powered web applications using cutting-edge technologies like **LLMs, Vector Databases, and Agentic Frameworks**.\n\nI combine expertise in **Laravel, React, Node.js**, and modern cloud architectures to deliver premium digital products. My passion lies at the intersection of robust backend systems and intuitive frontends.\n\n🚀 **50+ projects** completed and counting!",
                    type: 'about'
                };
                break;
            }

            case 'resume': {
                response = {
                    reply: "Sure! I'll start downloading the resume for you right away. 📄✨",
                    type: 'resume',
                    data: { downloadUrl: '/assets/resume.pdf' }
                };
                break;
            }

            default: {
                response = {
                    reply: "I'm not sure I understand that, but I can help you with:\n\n💡 **Skills** — Technical expertise & tools\n🚀 **Projects** — Portfolio showcase\n💼 **Experience** — Professional journey\n📝 **Blogs** — Latest articles & insights\n📧 **Contact** — Ways to reach out\n📄 **Resume** — Download CV\n\nTry asking about any of these!",
                    type: 'suggestions'
                };
                break;
            }
        }

        res.json(response);
    } catch (error) {
        console.error('Agent chat error:', error);
        res.status(500).json({
            reply: "Oops! Something went wrong on my end. Please try again in a moment. 🔧",
            type: 'error'
        });
    }
});

module.exports = router;
