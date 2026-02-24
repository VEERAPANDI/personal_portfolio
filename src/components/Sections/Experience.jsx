import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Sections.css';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Animate the height of the vertical line
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/experience`);
                const data = await res.json();
                setExperiences(data);
            } catch (err) {
                console.error('Failed to fetch experience', err);
                setExperiences([]);
            }
        };
        fetchExperience();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="experience" className="section-padding">
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }}
                    className="section-title"
                >
                    Professional Journey
                </motion.h2>

                <div className="timeline" ref={containerRef}>
                    {/* Animated vertical line */}
                    <motion.div
                        className="timeline-animated-line"
                        style={{ height: lineHeight }}
                    />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp._id}
                            className="timeline-item"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <div className="timeline-dot"></div>
                            <div className="timeline-content glass-panel">
                                <div className="timeline-header">
                                    <h3>{exp.role}</h3>
                                    <span className="timeline-date">{exp.workingYear || `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}</span>
                                </div>
                                <div className="timeline-company">
                                    <a href={exp.companyWebsite || '#'} target="_blank" rel="noopener noreferrer">
                                        {exp.company}
                                    </a>
                                </div>
                                <p className="timeline-description">{exp.description}</p>
                            </div>
                        </motion.div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="no-data-placeholder">
                            <p>Exploring new horizons and continuous learning.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Experience;
