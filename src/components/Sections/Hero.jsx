import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
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
        <section className="hero" id="hero">
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-greeting">👋 Hello, I'm</span>
                    <h1 className="hero-title">
                        <span className="text-gradient">Veerapandi Lakshmanan</span>
                    </h1>
                    <p className="hero-subtitle">Full Stack Developer | Blockchain & Web3 Developer | AI Enthusiast</p>
                    
                    <div className="hero-socials" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', marginTop: '1rem' }}>
                        <a href="https://github.com/VEERAPANDI" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                            <Github size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/veerapandi-l-520596111" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                            <Linkedin size={24} />
                        </a>
                        <a href="https://twitter.com/veerapandi97" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
                            <Twitter size={24} />
                        </a>
                        <a href="mailto:veerapandideveloper@gmail.com" className="social-icon" aria-label="Email">
                            <Mail size={24} />
                        </a>
                    </div>

                    <div className="hero-cta">
                        <a href="#contact" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Contact Me</a>
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

