import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import '../Sections/Sections.css';

const ContactManager = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, read, unread

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`);
            const data = await response.json();
            setContacts(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch contacts');
            setLoading(false);
        }
    };

    const toggleRead = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact/${id}/read`, {
                method: 'PATCH',
            });
            fetchContacts();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteContact = async (id) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;

        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact/${id}`, {
                method: 'DELETE',
            });
            fetchContacts();
        } catch (err) {
            alert('Failed to delete contact');
        }
    };

    const handleReply = (email, subject) => {
        window.location.href = `mailto:${email}?subject=Re: ${subject || 'Your Message'}`;
    };

    const filteredContacts = contacts.filter(contact => {
        if (filter === 'read') return contact.isRead;
        if (filter === 'unread') return !contact.isRead;
        return true;
    });

    const unreadCount = contacts.filter(c => !c.isRead).length;

    if (loading) return <div className="section-padding container"><p>Loading...</p></div>;

    return (
        <div className="section-padding container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Contact Messages ({contacts.length}) {unreadCount > 0 && <span style={{ color: '#f87171' }}>• {unreadCount} unread</span>}</h2>
                <button onClick={() => navigate('/admin/dashboard')} className="btn-primary" style={{ position: 'relative', zIndex: 1001 }}>Back to Dashboard</button>
            </div>

            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    All ({contacts.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={filter === 'unread' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Unread ({unreadCount})
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={filter === 'read' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Read ({contacts.length - unreadCount})
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredContacts.map((contact) => (
                    <div
                        key={contact._id}
                        style={{
                            background: contact.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(74, 222, 128, 0.1)',
                            border: contact.isRead ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(74, 222, 128, 0.3)',
                            borderRadius: '12px',
                            padding: '1.5rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {contact.name}
                                    {!contact.isRead && <span style={{ fontSize: '0.75rem', background: '#f87171', color: '#000', padding: '0.25rem 0.5rem', borderRadius: '8px', fontWeight: '600' }}>NEW</span>}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <Mail size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    {contact.email}
                                </p>
                                {contact.subject && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Subject: {contact.subject}</p>}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{contact.message}</p>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => handleReply(contact.email, contact.subject)}
                                className="btn-primary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                                Reply
                            </button>
                            <button
                                onClick={() => toggleRead(contact._id)}
                                className="btn-secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            >
                                Mark as {contact.isRead ? 'Unread' : 'Read'}
                            </button>
                            <button
                                onClick={() => deleteContact(contact._id)}
                                className="btn-secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#f87171' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredContacts.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    No {filter !== 'all' ? filter : ''} messages.
                </p>
            )}
        </div>
    );
};

export default ContactManager;
