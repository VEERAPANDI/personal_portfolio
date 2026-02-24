import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Sections.css';

const Skills = () => {
    const defaultLogos = [
        { name: 'Laravel', url: 'https://cdn.worldvectorlogo.com/logos/laravel-2.svg' },
        { name: 'HTML', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg' },
        { name: 'CSS', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' },
        { name: 'JS', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
        { name: 'Node.js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
        { name: 'React', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
        { name: 'Next.js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
        { name: 'MySQL', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg' },
        { name: 'Redis', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg' },
        { name: 'MongoDB', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg' },
        { name: 'PostgreSQL', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg' }
    ];

    const [skills] = useState(defaultLogos);

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

                <motion.div
                    className="skills-grid"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                translateY: -5,
                                boxShadow: "0 10px 30px rgba(100, 108, 255, 0.2)"
                            }}
                            className="skill-card glass-panel"
                        >
                            <img
                                src={skill.url}
                                alt={skill.name}
                                className="skill-logo"
                                loading="lazy"
                            />
                            <h3 className="skill-name">{skill.name}</h3>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
