import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import SEO from '../Common/SEO';
import './Sections.css';

const NotFound = () => {
    return (
        <section className="section-padding not-found-container">
            <SEO title="404 - Page Not Found | Veerapandi Lakshmanan" description="The page you are looking for does not exist." />
            <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="glass-panel not-found-card"
                >
                    <div className="not-found-glow-1"></div>
                    <div className="not-found-glow-2"></div>

                    <motion.div
                        initial={{ rotate: -15 }}
                        animate={{ rotate: [15, -15, 15] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="not-found-icon"
                    >
                        <Compass size={80} />
                    </motion.div>
                    
                    <h1 className="not-found-title text-gradient">
                        404
                    </h1>
                    <h2 className="not-found-subtitle">
                        Lost in cyberspace?
                    </h2>
                    <p className="not-found-text">
                        We can't seem to find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
                    </p>

                    <div className="not-found-actions">
                        <Link to="/" style={{ flex: 1 }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Home size={18} />
                                Back to Home
                            </motion.button>
                        </Link>
                        
                        <div style={{ flex: 1 }}>
                            <motion.button
                                onClick={() => window.history.back()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <ArrowLeft size={18} />
                                Go Back
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default NotFound;
