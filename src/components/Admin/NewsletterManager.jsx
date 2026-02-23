import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Sections/Sections.css';

const NewsletterManager = () => {
    const navigate = useNavigate();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/newsletter');
            const data = await response.json();
            setSubscriptions(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch subscriptions');
            setLoading(false);
        }
    };

    const toggleActive = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/newsletter/${id}/toggle`, {
                method: 'PATCH',
            });
            fetchSubscriptions();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const deleteSubscription = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subscription?')) return;

        try {
            await fetch(`http://localhost:5000/api/newsletter/${id}`, {
                method: 'DELETE',
            });
            fetchSubscriptions();
        } catch (err) {
            alert('Failed to delete subscription');
        }
    };

    const exportToCSV = () => {
        if (subscriptions.length === 0) {
            alert('No subscriptions to export');
            return;
        }

        try {
            // Helper function to escape CSV fields
            const escapeCSV = (field) => {
                if (field === null || field === undefined) return '';
                const str = String(field);
                if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            };

            // Create CSV content
            const headers = ['Name', 'Email', 'Status', 'Subscribed Date'];
            const rows = subscriptions.map(sub => [
                escapeCSV(sub.name),
                escapeCSV(sub.email),
                escapeCSV(sub.isActive ? 'Active' : 'Inactive'),
                escapeCSV(new Date(sub.createdAt).toLocaleDateString())
            ]);

            const csvContent = [headers, ...rows]
                .map(row => row.join(','))
                .join('\n');

            // Create blob with UTF-8 BOM
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = 'newsletter_subscriptions.csv';

            // Append to body, click, and cleanup after delay
            document.body.appendChild(link);
            link.click();

            // Cleanup after a delay to ensure download starts
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 1000);

            console.log('CSV export initiated');
        } catch (error) {
            console.error('CSV export error:', error);
            alert('Failed to export CSV');
        }
    };

    if (loading) return <div className="section-padding container"><p>Loading...</p></div>;

    return (
        <div className="section-padding container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Newsletter Subscriptions ({subscriptions.length})</h2>
                <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 1001 }}>
                    <button onClick={exportToCSV} className="btn-secondary">Export CSV</button>
                    <button onClick={() => navigate('/admin/dashboard')} className="btn-primary">Back to Dashboard</button>
                </div>
            </div>

            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Subscribed</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub._id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ padding: '1rem' }}>{sub.name}</td>
                                <td style={{ padding: '1rem' }}>{sub.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        background: sub.isActive ? '#4ade80' : '#f87171',
                                        color: '#000',
                                        fontSize: '0.85rem',
                                        fontWeight: '600'
                                    }}>
                                        {sub.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(sub.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => toggleActive(sub._id)}
                                        className="btn-secondary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                    >
                                        {sub.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => deleteSubscription(sub._id)}
                                        className="btn-primary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#f87171' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {subscriptions.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    No subscriptions yet.
                </p>
            )}
        </div>
    );
};

export default NewsletterManager;
