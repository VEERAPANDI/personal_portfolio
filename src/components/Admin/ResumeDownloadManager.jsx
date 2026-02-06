import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Monitor, Bot, FileText } from 'lucide-react';
import '../Sections/Sections.css';

const ResumeDownloadManager = () => {
    const navigate = useNavigate();
    const [downloads, setDownloads] = useState([]);
    const [stats, setStats] = useState({ total: 0, bySource: { hero: 0, footer: 0, agent: 0 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, hero, footer, agent

    useEffect(() => {
        fetchDownloads();
    }, []);

    const fetchDownloads = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/resume/downloads');
            const data = await response.json();
            setDownloads(data.downloads);
            setStats(data.stats);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch download records');
            setLoading(false);
        }
    };

    const filteredDownloads = downloads.filter(download => {
        if (filter === 'all') return true;
        return download.source === filter;
    });

    const maskIP = (ip) => {
        if (!ip) return 'N/A';
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.xxx.xxx`;
        }
        return ip.substring(0, 10) + '...';
    };

    const getSourceIcon = (source) => {
        switch (source) {
            case 'hero': return <Monitor size={16} />;
            case 'footer': return <FileText size={16} />;
            case 'agent': return <Bot size={16} />;
            default: return <Download size={16} />;
        }
    };

    if (loading) return <div className="section-padding container"><p>Loading...</p></div>;

    return (
        <div className="section-padding container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Resume Downloads ({stats.total})</h2>
                <button onClick={() => navigate('/admin/dashboard')} className="btn-primary" style={{ position: 'relative', zIndex: 1001 }}>Back to Dashboard</button>
            </div>

            {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="stat-card">
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stats.total}</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Total Downloads</p>
                </div>
                <div className="stat-card">
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Monitor size={24} /> {stats.bySource.hero}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>From Hero Section</p>
                </div>
                <div className="stat-card">
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={24} /> {stats.bySource.footer}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>From Footer</p>
                </div>
                <div className="stat-card">
                    <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Bot size={24} /> {stats.bySource.agent}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>From AI Agent</p>
                </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('hero')}
                    className={filter === 'hero' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Hero ({stats.bySource.hero})
                </button>
                <button
                    onClick={() => setFilter('footer')}
                    className={filter === 'footer' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Footer ({stats.bySource.footer})
                </button>
                <button
                    onClick={() => setFilter('agent')}
                    className={filter === 'agent' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    Agent ({stats.bySource.agent})
                </button>
            </div>

            {/* Downloads Table */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Date & Time</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Source</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>IP Address</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>User Agent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDownloads.map((download) => (
                            <tr key={download._id} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <td style={{ padding: '1rem' }}>
                                    {new Date(download.createdAt).toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        background: download.source === 'hero' ? '#60a5fa' : download.source === 'footer' ? '#a78bfa' : '#f472b6',
                                        color: '#000',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                        {getSourceIcon(download.source)}
                                        {download.source}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {maskIP(download.ipAddress)}
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {download.userAgent || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredDownloads.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                    No downloads {filter !== 'all' ? `from ${filter}` : 'yet'}.
                </p>
            )}
        </div>
    );
};

export default ResumeDownloadManager;
