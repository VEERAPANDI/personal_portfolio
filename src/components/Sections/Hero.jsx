import React from 'react';
import HeroTerminal from './HeroTerminal';
import './Sections.css';

const Hero = () => {
    const handleResumeDownload = async () => {
        try {
            // Track the download
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ source: 'hero' }),
            });
        } catch (error) {
            console.error('Error tracking download:', error);
        }

        // Initiate download - using window.open for better compatibility
        window.open('/assets/resume.pdf', '_blank');
    };

    return (
        <section className="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-greeting">I'm Veerapandi Lakshmanan</span>
                    <h1 className="hero-title">
                        <span className="text-gradient">Veerapandi Lakshmanan</span>
                    </h1>
                    <p className="hero-subtitle">Senior Web Developer</p>
                    <div className="hero-cta">
                        <button className="btn-primary">View Portfolio</button>
                        <button onClick={handleResumeDownload} className="btn-secondary">Download Resume</button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="glow-orb"></div>
                    <HeroTerminal />
                </div>
            </div>
        </section>
    );
};

export default Hero;

