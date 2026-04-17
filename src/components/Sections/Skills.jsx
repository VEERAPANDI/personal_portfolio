import React from 'react';
import { motion } from 'framer-motion';
import './Sections.css';

const Skills = () => {
    const skillCategories = [
        {
            title: "Backend & Architecture",
            skills: [
                { name: 'Laravel (PHP)', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/laravel/laravel-original.svg' },
                { name: 'Node.js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
                { name: 'REST API', url: 'https://img.icons8.com/color/48/api-settings.png' },
                { name: 'Microservices', url: 'https://img.icons8.com/color/48/services.png' },
                { name: 'web3 Integration', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpjeIhR-t95cX-RgaUcPWZLpI9jWUbMVxbjA&s' },
                { name: 'Payment Gateways', url: 'https://img.icons8.com/color/48/stripe.png' }
            ]
        },
        {
            title: "Cloud & DevOps",
            skills: [
                { name: 'AWS (EC2, S3, RDS)', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
                { name: 'Server Deployment', url: 'https://img.icons8.com/color/48/server.png' },
                { name: 'Git / GitHub', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg' },
                { name: 'CI/CD (Basic)', url: 'https://cdn-icons-png.flaticon.com/512/16942/16942646.png' },
                { name: 'Docker (Basic)', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg' }
            ]
        },
        {
            title: "Frontend",
            skills: [
                { name: 'Next.js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
                { name: 'React.js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
                { name: 'Vue.js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg' },
                { name: 'Javascript', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
                { name: 'jQuery', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/jquery/jquery-original.svg' },
                { name: 'Bootstrap', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg' }
            ]
        },
        {
            title: "AI & Emerging Tech",
            skills: [
                { name: 'Python (Basic)', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg' },
                { name: 'LLM Integration', url: 'https://img.icons8.com/color/48/artificial-intelligence.png' },
                { name: 'AI Vectorization', url: 'https://img.icons8.com/fluency/48/scatter-plot.png' },
                { name: 'RAG Architecture', url: 'https://img.icons8.com/color/48/data-configuration.png' },
                { name: 'AI Tools', url: 'https://img.icons8.com/color/48/bot.png' }
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <section id="skill" className="section-padding">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="section-title"
                >
                    Technical Expertise
                </motion.h2>

                <div className="skills-categories-container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {skillCategories.map((category, catIndex) => (
                        <div key={catIndex} className="skill-category">
                            <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--text-primary)' }}
                            >
                                {category.title}
                            </motion.h3>
                            <motion.div
                                className="skills-grid"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                            >
                                {category.skills.map((skill, index) => (
                                    <motion.div
                                        key={index}
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.05,
                                            translateY: -5,
                                            boxShadow: "0 10px 30px rgba(var(--primary-color-rgb), 0.2)"
                                        }}
                                        className="skill-card glass-panel"
                                    >
                                        <img
                                            src={skill.url}
                                            alt={skill.name}
                                            className="skill-logo"
                                            loading="lazy"
                                        />
                                        <h3 className="skill-name" style={{ fontSize: '0.9rem', marginTop: '10px' }}>{skill.name}</h3>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
