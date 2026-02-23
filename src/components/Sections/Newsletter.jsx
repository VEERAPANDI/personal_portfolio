import React, { useState } from 'react';
import './Sections.css';

const Newsletter = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubscribed(true);
                setFormData({ name: '', email: '' });
            } else {
                setError(data.message || 'Failed to subscribe. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-box glass-panel">
                    <h3>Subscribe to my Newsletter</h3>
                    <p>Get the latest updates on my projects and tech articles.</p>

                    {subscribed ? (
                        <p className="success-msg">Thanks for subscribing!</p>
                    ) : (
                        <>
                            {error && <p className="error-msg" style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                            <form onSubmit={handleSubscribe} className="newsletter-form">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Newsletter;

