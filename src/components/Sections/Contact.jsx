import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Sections.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('sent');
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error('Failed to send message', err);
            setStatus('error');
        }
    };

    const inputVariants = {
        default: { scale: 1, boxShadow: "none" },
        focus: { scale: 1.02, boxShadow: "0 0 15px rgba(100, 108, 255, 0.4)" }
    };

    return (
        <section id="contact" className="section-padding">
            <div className="container contact-container">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Let's Connect</h2>
                    <p className="contact-text">
                        Have a project in mind? Want to discuss a potential partnership?
                        Or just want to say hi? Drop me a line.
                    </p>
                </motion.div>

                <motion.form
                    className="contact-form glass-panel"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <motion.input
                            variants={inputVariants}
                            animate={focusedField === 'name' ? 'focus' : 'default'}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <motion.input
                            variants={inputVariants}
                            animate={focusedField === 'email' ? 'focus' : 'default'}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <motion.textarea
                            variants={inputVariants}
                            animate={focusedField === 'message' ? 'focus' : 'default'}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            id="message"
                            rows="4"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        ></motion.textarea>
                    </div>
                    <motion.button
                        type="submit"
                        className="btn-primary"
                        disabled={status === 'sending'}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
                    </motion.button>
                </motion.form>
            </div>
        </section>
    );
};

export default Contact;
