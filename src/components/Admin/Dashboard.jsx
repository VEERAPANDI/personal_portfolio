import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Sections/Sections.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    return (
        <div className="section-padding container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2>Admin Dashboard</h2>
                <button onClick={handleLogout} className="btn-secondary" style={{ position: 'relative', zIndex: 1001 }}>Logout</button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Manage</h3>
                    <p>Projects</p>
                    <Link to="/admin/projects" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Edit Projects</Link>
                </div>
                <div className="stat-card">
                    <h3>Manage</h3>
                    <p>Skills</p>
                    <Link to="/admin/skills" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Edit Skills</Link>
                </div>
                <div className="stat-card">
                    <h3>Manage</h3>
                    <p>Experience</p>
                    <Link to="/admin/experience" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Edit Experience</Link>
                </div>
                <div className="stat-card">
                    <h3>Manage</h3>
                    <p>Blog Posts</p>
                    <Link to="/admin/blogs" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Edit Blogs</Link>
                </div>
                <div className="stat-card">
                    <h3>View</h3>
                    <p>Newsletter Subscriptions</p>
                    <Link to="/admin/newsletter" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>View Subscribers</Link>
                </div>
                <div className="stat-card">
                    <h3>View</h3>
                    <p>Contact Messages</p>
                    <Link to="/admin/contacts" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>View Messages</Link>
                </div>
                <div className="stat-card">
                    <h3>View</h3>
                    <p>Resume Downloads</p>
                    <Link to="/admin/resume-downloads" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>View Analytics</Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

