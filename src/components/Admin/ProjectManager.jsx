import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnsplashImagePicker from './UnsplashImagePicker';
import '../Sections/Sections.css';

/**
 * ProjectManager Component
 * 
 * Custom content manager for projects with Unsplash Image Picker integration.
 * Features:
 * - Unsplash image selection with automatic optimization
 * - No SEO settings (simpler than BlogManager)
 */
const ProjectManager = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        featuredImage: null
    });
    const [editingId, setEditingId] = useState(null);
    const navigate = useNavigate();

    const endpoint = 'projects';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId
            ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}/${editingId}`
            : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}`;

        try {
            // Convert tags string to array if present
            const dataToSave = { ...formData };
            if (typeof dataToSave.tags === 'string') {
                dataToSave.tags = dataToSave.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            } else if (!dataToSave.tags) {
                dataToSave.tags = [];
            }

            const token = localStorage.getItem('adminToken');
            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSave)
            });
            if (res.ok) {
                fetchItems();
                setFormData({
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
        const itemToEdit = JSON.parse(JSON.stringify(item));

        // Convert tags array to string for editing
        if (itemToEdit.tags && Array.isArray(itemToEdit.tags)) {
            itemToEdit.tags = itemToEdit.tags.join(', ');
        }

        // Ensure featuredImage exists
        if (!itemToEdit.featuredImage) itemToEdit.featuredImage = null;

        setFormData(itemToEdit);
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

    // Field definitions
    const fields = [
        { name: 'title', label: 'Project Name' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'link', label: 'Project Link' },
        { name: 'githubLink', label: 'GitHub Link' },
        { name: 'tags', label: 'Technologies (comma separated)' }
    ];

    return (
        <div className="section-padding container admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Job Achieved Projects</h2>
                <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Back to Dashboard</button>
            </div>

            <div className="glass-panel admin-form-container" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3>{editingId ? 'Edit Project' : 'Add New Project'}</h3>
                <form onSubmit={handleSubmit} key={editingId || 'new'}>
                    {/* Basic Fields */}
                    <div className="form-section">
                        <h4>Project Information</h4>
                        {fields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={formData[field.name] || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={formData[field.name] || ''}
                                        onChange={e => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Featured Image with Unsplash Picker */}
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
                                    featuredImage: null
                                }); 
                            }} className="btn-secondary">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3>Existing Job Achieved Projects</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{item._id.substring(item._id.length - 6)}</td>
                                <td style={{ padding: '1rem' }}>{item.title}</td>
                                <td style={{ padding: '1rem' }}>
                                    {item.featuredImage?.optimized_image_url ? (
                                        <img 
                                            src={item.featuredImage.optimized_image_url} 
                                            alt="" 
                                            style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : item.image ? (
                                        <img 
                                            src={item.image} 
                                            alt="" 
                                            style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    ) : (
                                        <span style={{ color: '#888', fontSize: '0.75rem' }}>No image</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => handleEdit(item)} style={{ marginRight: '1rem', background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectManager;
