import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnsplashImagePicker from './UnsplashImagePicker';
import '../Sections/Sections.css';

/**
 * PersonalProjectManager Component
 * 
 * Manages Personal Projects with GitHub fetch integration.
 */
const PersonalProjectManager = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        githubLink: '',
        language: '',
        stars: 0,
        homepage: '',
        featuredImage: null
    });
    const [editingId, setEditingId] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('');
    const navigate = useNavigate();

    const endpoint = 'personal-projects';

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}?admin=true`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items', err);
        }
    };

    const handleFetchFromGithub = async () => {
        if (!formData.githubLink || !formData.githubLink.includes('github.com/')) {
            setFetchStatus('Please enter a valid GitHub repository URL.');
            return;
        }

        try {
            setFetchStatus('Fetching...');
            // extract 'user/repo' from 'https://github.com/user/repo'
            let repoPath = formData.githubLink.split('github.com/')[1];
            // remove trailing slash if any
            if (repoPath.endsWith('/')) {
                repoPath = repoPath.slice(0, -1);
            }
            // in case they pass something with extra query params, trim it
            repoPath = repoPath.split('?')[0];

            const gitRes = await fetch(`https://api.github.com/repos/${repoPath}`);
            if (!gitRes.ok) {
                setFetchStatus('Repository not found or API rate limited.');
                return;
            }
            const gitData = await gitRes.json();
            
            setFormData(prev => ({
                ...prev,
                title: gitData.name,
                description: gitData.description || '',
                language: gitData.language || '',
                stars: gitData.stargazers_count || 0,
                homepage: gitData.homepage || ''
            }));
            setFetchStatus('Success! Fetched data from GitHub.');
            
            // clear success message after 3 seconds
            setTimeout(() => setFetchStatus(''), 3000);
        } catch (err) {
            console.error(err);
            setFetchStatus('Error fetching from GitHub.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}/${editingId}`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}`;

        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchItems();
                setFormData({
                    title: '',
                    description: '',
                    githubLink: '',
                    language: '',
                    stars: 0,
                    homepage: '',
                    featuredImage: null
                });
                setEditingId(null);
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.message}`);
            }
        } catch (err) {
            console.error('Failed to save item', err);
            alert('Failed to save item. Check console for details.');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title || '',
            description: item.description || '',
            githubLink: item.githubLink || '',
            language: item.language || '',
            stars: item.stars || 0,
            homepage: item.homepage || '',
            featuredImage: item.featuredImage || null
        });
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchItems();
        } catch (err) {
            console.error('Failed to delete item', err);
        }
    };

    const handleImageSelect = (imageData) => {
        setFormData(prev => ({
            ...prev,
            featuredImage: imageData
        }));
    };

    const handleImageClear = () => {
        setFormData(prev => ({
            ...prev,
            featuredImage: null
        }));
    };

    return (
        <div className="section-padding container admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Personal Projects</h2>
                <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Back to Dashboard</button>
            </div>

            <div className="glass-panel admin-form-container" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3>{editingId ? 'Edit Personal Project' : 'Add New Personal Project'}</h3>
                
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '0.5rem', color: '#ccc' }}><strong>Tip:</strong> Enter a GitHub URL first, then click "Fetch from GitHub" to automatically fill out the details!</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="https://github.com/VEERAPANDI/my-project"
                                value={formData.githubLink}
                                onChange={e => setFormData(prev => ({ ...prev, githubLink: e.target.value }))}
                                style={{ width: '100%', marginBottom: '0.5rem' }}
                            />
                            {fetchStatus && <span style={{ color: fetchStatus.includes('Error') || fetchStatus.includes('Please') || fetchStatus.includes('not') ? '#f87171' : '#4ade80', fontSize: '0.9rem' }}>{fetchStatus}</span>}
                        </div>
                        <button type="button" onClick={handleFetchFromGithub} className="btn-secondary" style={{ padding: '0.8rem 1.5rem' }}>
                            Fetch Details
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} key={editingId || 'new'}>
                    <div className="form-section">
                        <h4>Project Information</h4>
                        
                        <div className="form-group">
                            <label>Project Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                required
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label>Language</label>
                            <input
                                type="text"
                                value={formData.language}
                                onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
                            />
                        </div>

                        <div className="form-group">
                            <label>Stars</label>
                            <input
                                type="number"
                                value={formData.stars}
                                onChange={e => setFormData(prev => ({ ...prev, stars: parseInt(e.target.value) || 0 }))}
                            />
                        </div>

                        <div className="form-group">
                            <label>Live Homepage URL (Optional)</label>
                            <input
                                type="text"
                                value={formData.homepage}
                                onChange={e => setFormData(prev => ({ ...prev, homepage: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h4>Project Image</h4>
                        <div className="form-group">
                            <UnsplashImagePicker
                                onImageSelect={handleImageSelect}
                                selectedImage={formData.featuredImage}
                                onClear={handleImageClear}
                                placeholder="Search for project images..."
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
                        {editingId && (
                            <button type="button" onClick={() => { 
                                setEditingId(null); 
                                setFormData({
                                    title: '',
                                    description: '',
                                    githubLink: '',
                                    language: '',
                                    stars: 0,
                                    homepage: '',
                                    featuredImage: null
                                }); 
                                setFetchStatus('');
                            }} className="btn-secondary">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3>Existing Personal Projects</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>GitHub</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>No personal projects found.</td>
                            </tr>
                        ) : (
                            items.map(item => (
                                <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {item.featuredImage?.optimized_image_url ? (
                                            <img 
                                                src={item.featuredImage.optimized_image_url} 
                                                alt="" 
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '1rem', verticalAlign: 'middle' }}
                                            />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', display: 'inline-block', marginRight: '1rem', verticalAlign: 'middle' }}></div>
                                        )}
                                        {item.title}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <a href={item.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)' }}>View</a>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button onClick={() => handleEdit(item)} style={{ marginRight: '1rem', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PersonalProjectManager;
