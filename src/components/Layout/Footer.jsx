import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import './Layout.css';

const Footer = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterName, setNewsletterName] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('');

    const handleResumeDownload = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source: 'footer' }),
            });
        } catch (error) {
            console.error('Error tracking download:', error);
        }

        // Initiate download - using window.open for better compatibility
        window.open('/assets/resume.pdf', '_blank');
    };

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newsletterName, email: newsletterEmail }),
            });
            const data = await response.json();
            if (response.ok) {
                setNewsletterStatus('Subscribed!');
                setNewsletterEmail('');
                setNewsletterName('');
            } else {
                setNewsletterStatus(data.message);
            }
        } catch (error) {
            setNewsletterStatus('Error subscribing');
        }
    };
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4rem' }}>
                    <div className="footer-brand">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="VP" style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                        <h3>Veerapandi Lakshmanan</h3>
                        <p>Senior Web Developer building intelligent solutions.</p>
                        <button onClick={handleResumeDownload} className="btn-secondary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Download Resume</button>
                    </div>

                    <div className="footer-newsletter">
                        <h4>Subscribe to My Newsletter</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Get the latest updates on AI and Web Development.</p>
                        {newsletterStatus && <p style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{newsletterStatus}</p>}
                        <form className="newsletter-form" style={{ marginTop: '0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} onSubmit={handleNewsletterSubmit}>
                            <input type="text" placeholder="Your Name" value={newsletterName} onChange={(e) => setNewsletterName(e.target.value)} required />
                            <input type="email" placeholder="Email Address" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} required />
                            <button type="submit" className="btn-primary">Subscribe</button>
                        </form>
                    </div>

                    <div className="footer-social-wrapper" style={{ textAlign: 'right' }}>
                        <h4>Connect With Me</h4>
                        <div className="social-links" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer"><Github className="social-icon" /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><Linkedin className="social-icon" /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><Twitter className="social-icon" /></a>
                            <a href="mailto:contact@example.com"><Mail className="social-icon" /></a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom" style={{ marginTop: '4rem' }}>
                    <p>&copy; {new Date().getFullYear()} Veerapandi Lakshmanan. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
