import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('gdpr_consent');
        if (!consent) {
            // Slight delay before showing so it isn't too aggressive on initial load
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (consent === 'true' && typeof window.loadGoogleAnalytics === 'function') {
            // Load immediately if previously accepted
            window.loadGoogleAnalytics();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('gdpr_consent', 'true');
        setIsVisible(false);
        if (typeof window.loadGoogleAnalytics === 'function') {
            window.loadGoogleAnalytics();
        }
    };

    const handleDecline = () => {
        localStorage.setItem('gdpr_consent', 'false');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                    className="cookie-banner-container"
                >
                    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div className="cookie-banner-glow"></div>
                        
                        <div className="cookie-banner-header">
                            <div className="cookie-banner-title">
                                <div className="cookie-icon-wrapper">
                                    <Cookie size={22} />
                                </div>
                                <h3>Cookie Consent</h3>
                            </div>
                            <button onClick={handleDecline} className="cookie-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <p className="cookie-banner-text">
                            We use cookies to improve user experience, and analyze website traffic. For these reasons, we may share your site usage data with our analytics partners in compliance with GDPR.
                        </p>
                        
                        <div className="cookie-banner-actions">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDecline}
                                className="btn-cookie-decline"
                            >
                                Decline
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAccept}
                                className="btn-cookie-accept"
                            >
                                Accept All
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieBanner;
