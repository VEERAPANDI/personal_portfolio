import React, { useState, useEffect } from 'react';
import './Sections.css';

const About = () => {
    return (
        <section id="about" className="section-padding">
            <div className="container about-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'center' }}>
                    <div className="about-image glass-panel">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" alt="Veerapandi" style={{ width: '100%', borderRadius: '12px' }} />
                    </div>
                    <div className="about-content">
                        <h2 className="section-title">About Me</h2>
                        <div className="about-text">
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                As a <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Senior Web Developer</span> with over 8 years of experience, I specialize in building highly scalable, AI-powered web applications. My passion lies at the intersection of robust backend architectures and intuitive, dynamic frontends.
                            </p>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                                I leverage cutting-edge technologies like <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>LLMs, Vector Databases, and Agentic Frameworks</span> to transform traditional web platforms into intelligent systems. Whether it's optimizing Laravel performance or crafting seamless React interfaces, I focus on delivering state-of-the-art solutions that wow users.
                            </p>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                                My approach combines clean code principles with innovative problem-solving, ensuring every project is not just functional but also a premium experience.
                            </p>
                        </div>
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem' }}>
                            <div className="stat-card">
                                <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>8+</h3>
                                <p>Years of Experience</p>
                            </div>
                            <div className="stat-card">
                                <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>50+</h3>
                                <p>Projects Completed</p>
                            </div>
                            <div className="stat-card">
                                <h3 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>AI</h3>
                                <p>Tech Enthusiast</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
