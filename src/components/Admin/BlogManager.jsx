import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UnsplashImagePicker from './UnsplashImagePicker';
import '../Sections/Sections.css';

/**
 * BlogManager Component
 * 
 * Custom content manager for blog posts with Unsplash Image Picker integration.
 * Features:
 * - Rich text editing with ReactQuill
 * - Unsplash image selection with automatic optimization
 * - SEO configuration fields
 * - RAG (AI) configuration fields
 */
const BlogManager = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({
        seo: {},
        rag: { isEnabled: true, priority: 5, category: 'general', contextWindow: 2000, embeddingModel: 'text-embedding-3-small' },
        featuredImage: null
    });
    const [editingId, setEditingId] = useState(null);
    const [isSourceView, setIsSourceView] = useState({});
    const navigate = useNavigate();

    const endpoint = 'blog';

    const quillModules = useMemo(() => ({
        syntax: window.hljs ? true : false,
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    }), []);

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

            // Auto-populate SEO fields if empty
            if (!dataToSave.seo?.metaTitle && dataToSave.title) {
                dataToSave.seo = { ...dataToSave.seo, metaTitle: dataToSave.title };
            }
            if (!dataToSave.seo?.metaDescription && dataToSave.excerpt) {
                dataToSave.seo = { ...dataToSave.seo, metaDescription: dataToSave.excerpt };
            }
            if (!dataToSave.seo?.metaKeywords && dataToSave.tags?.length > 0) {
                dataToSave.seo = { ...dataToSave.seo, metaKeywords: dataToSave.tags.join(', ') };
            }
            // Use featured image as OG image if not specified
            if (!dataToSave.seo?.ogImage && dataToSave.featuredImage?.optimized_image_url) {
                dataToSave.seo = { ...dataToSave.seo, ogImage: dataToSave.featuredImage.optimized_image_url };
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
                    seo: {},
                    rag: { isEnabled: true, priority: 5, category: 'general', contextWindow: 2000, embeddingModel: 'text-embedding-3-small' },
                    featuredImage: null
                });
                setEditingId(null);
                setIsSourceView({});
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.message}`);
            }
        } catch (err) {
            console.error('Failed to save item', err);
            alert('Failed to save item. Check console for details.');
        }
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    const setNestedValue = (obj, path, value) => {
        const keys = path.split('.');
        const result = { ...obj };
        let current = result;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return result;
    };

    const handleEdit = (item) => {
        const itemToEdit = JSON.parse(JSON.stringify(item));

        // Convert tags array to string for editing
        if (itemToEdit.tags && Array.isArray(itemToEdit.tags)) {
            itemToEdit.tags = itemToEdit.tags.join(', ');
        }

        // Ensure nested objects exist
        if (!itemToEdit.seo) itemToEdit.seo = {};
        if (!itemToEdit.rag) itemToEdit.rag = { isEnabled: true, priority: 5, category: 'general' };
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

    const renderField = (field) => {
        const value = getNestedValue(formData, field.name);

        if (field.type === 'textarea') {
            return (
                <textarea
                    value={value || ''}
                    onChange={e => {
                        const val = e.target.value;
                        setFormData(prev => setNestedValue(prev, field.name, val));
                    }}
                />
            );
        }

        if (field.type === 'richtext') {
            return (
                <div className="quill-container">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                            onClick={() => setIsSourceView({ ...isSourceView, [field.name]: !isSourceView[field.name] })}
                        >
                            {isSourceView[field.name] ? 'Show Visual Editor' : 'Show HTML Source'}
                        </button>
                    </div>
                    {isSourceView[field.name] ? (
                        <textarea
                            value={value || ''}
                            onChange={e => setFormData(prev => setNestedValue(prev, field.name, e.target.value))}
                            style={{ height: '300px', fontFamily: 'monospace' }}
                        />
                    ) : (
                        <ReactQuill
                            theme="snow"
                            value={value || ''}
                            onChange={(value) => setFormData(prev => setNestedValue(prev, field.name, value))}
                            modules={quillModules}
                        />
                    )}
                </div>
            );
        }

        if (field.type === 'checkbox') {
            return (
                <input
                    type="checkbox"
                    checked={value || false}
                    onChange={e => setFormData(prev => setNestedValue(prev, field.name, e.target.checked))}
                    style={{ width: 'auto', marginRight: '1rem' }}
                />
            );
        }

        if (field.type === 'number') {
            return (
                <input
                    type="number"
                    value={value === undefined || value === null ? '' : value}
                    onChange={e => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setFormData(prev => setNestedValue(prev, field.name, val));
                    }}
                />
            );
        }

        if (field.type === 'select') {
            return (
                <select
                    value={value || ''}
                    onChange={e => setFormData(prev => setNestedValue(prev, field.name, e.target.value))}
                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                >
                    <option value="">Select...</option>
                    {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={field.type || 'text'}
                value={value || ''}
                onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => setNestedValue(prev, field.name, val));
                }}
            />
        );
    };

    // Field definitions
    const basicFields = [
        { name: 'title', label: 'Title' },
        { name: 'slug', label: 'Slug (URL friendly)' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'content', label: 'Content (Rich Text)', type: 'richtext' },
        { name: 'tags', label: 'Tags (comma separated)' },
        { name: 'readTime', label: 'Read Time (e.g., "5 min read")' },
        { name: 'isPublished', label: 'Published', type: 'checkbox' }
    ];

    const seoFields = [
        { name: 'seo.metaTitle', label: 'SEO Meta Title (optional, defaults to title)' },
        { name: 'seo.metaDescription', label: 'SEO Meta Description (optional, defaults to excerpt)', type: 'textarea' },
        { name: 'seo.metaKeywords', label: 'SEO Meta Keywords (optional, defaults to tags)' },
        { name: 'seo.ogImage', label: 'SEO OG Image URL (optional, defaults to featured image)' },
        { name: 'seo.canonicalUrl', label: 'Canonical URL (optional)' },
        { name: 'seo.robotsMeta', label: 'Robots Meta', type: 'select', options: ['index, follow', 'noindex, nofollow', 'index, nofollow', 'noindex, follow'] }
    ];

    const ragFields = [
        { name: 'rag.isEnabled', label: 'RAG Enabled (AI can index this content)', type: 'checkbox' },
        { name: 'rag.priority', label: 'RAG Priority (1-10, higher = more important)', type: 'number' },
        { name: 'rag.category', label: 'RAG Category (e.g., technical, tutorial, opinion)' },
        { name: 'rag.contextWindow', label: 'RAG Context Window (token limit)', type: 'number' },
        { name: 'rag.embeddingModel', label: 'Embedding Model' }
    ];

    return (
        <div className="section-padding container admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage Blog Posts</h2>
                <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Back to Dashboard</button>
            </div>

            <div className="glass-panel admin-form-container" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3>{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
                <form onSubmit={handleSubmit} key={editingId || 'new'}>
                    {/* Basic Fields */}
                    <div className="form-section">
                        <h4>Basic Information</h4>
                        {basicFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}</label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    {/* Featured Image with Unsplash Picker */}
                    <div className="form-section">
                        <h4>Featured Image</h4>
                        <div className="form-group">
                            <UnsplashImagePicker
                                onImageSelect={handleImageSelect}
                                selectedImage={formData.featuredImage}
                                onClear={handleImageClear}
                                placeholder="Search for featured images..."
                            />
                        </div>
                    </div>

                    {/* SEO Configuration */}
                    <div className="form-section">
                        <h4>SEO Configuration</h4>
                        {seoFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}</label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    {/* RAG Configuration */}
                    <div className="form-section">
                        <h4>RAG (AI) Configuration</h4>
                        {ragFields.map(field => (
                            <div key={field.name} className="form-group">
                                <label>{field.label}</label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
                        {editingId && (
                            <button type="button" onClick={() => { 
                                setEditingId(null); 
                                setFormData({
                                    seo: {},
                                    rag: { isEnabled: true, priority: 5, category: 'general', contextWindow: 2000, embeddingModel: 'text-embedding-3-small' },
                                    featuredImage: null
                                }); 
                            }} className="btn-secondary">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3>Existing Blog Posts</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Status</th>
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
                                    <span style={{ 
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: '4px',
                                        background: item.isPublished ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: item.isPublished ? '#22c55e' : '#ef4444',
                                        fontSize: '0.75rem'
                                    }}>
                                        {item.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {item.featuredImage?.optimized_image_url ? (
                                        <img 
                                            src={item.featuredImage.optimized_image_url} 
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

export default BlogManager;
