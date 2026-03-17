import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../Sections/Sections.css';

const ContentManager = ({ title, endpoint, fields }) => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [isSourceView, setIsSourceView] = useState({});
    const navigate = useNavigate();

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
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}?admin=true`);
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
            console.log('Submitting form data:', formData);
            // Convert tags string to array if present
            const dataToSave = { ...formData };
            if (typeof dataToSave.tags === 'string') {
                dataToSave.tags = dataToSave.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
            } else if (!dataToSave.tags) {
                dataToSave.tags = [];
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });
            if (res.ok) {
                console.log('Save successful');
                fetchItems();
                setFormData({});
                setEditingId(null);
                setIsSourceView({}); // Reset source view on save
            } else {
                const errData = await res.json();
                console.error('Save failed:', errData);
                alert(`Error: ${errData.message}`);
            }
        } catch (err) {
            console.error('Failed to save item', err);
            alert('Failed to save item. Check console for details.');
        }
    };

    // Helper function to get nested value from object
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    // Helper function to set nested value in object
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
        console.log('Editing item:', item);
        // Reset source view mode for all fields
        setIsSourceView({});

        // Deep copy of the item to ensure no weird references
        const itemToEdit = JSON.parse(JSON.stringify(item));

        // Convert tags array to string for editing
        if (itemToEdit.tags && Array.isArray(itemToEdit.tags)) {
            itemToEdit.tags = itemToEdit.tags.join(', ');
        }

        // Ensure nested objects exist for SEO and RAG
        if (!itemToEdit.seo) itemToEdit.seo = {};
        if (!itemToEdit.rag) itemToEdit.rag = {};

        setFormData(itemToEdit);
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}/${id}`, { method: 'DELETE' });
            fetchItems();
        } catch (err) {
            console.error('Failed to delete item', err);
        }
    };

    return (
        <div className="section-padding container admin-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Manage {title}</h2>
                <button onClick={() => navigate('/admin/dashboard')} className="btn-secondary">Back to Dashboard</button>
            </div>

            <div className="glass-panel admin-form-container" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
                <form onSubmit={handleSubmit} key={editingId || 'new'}>
                    {fields.map(field => (
                        <div key={field.name} className="form-group">
                            <label>{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={getNestedValue(formData, field.name) || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => setNestedValue(prev, field.name, val));
                                    }}
                                />
                            ) : field.type === 'richtext' ? (
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
                                            value={getNestedValue(formData, field.name) || ''}
                                            onChange={e => setFormData(prev => setNestedValue(prev, field.name, e.target.value))}
                                            style={{ height: '300px', fontFamily: 'monospace' }}
                                        />
                                    ) : (
                                        <ReactQuill
                                            theme="snow"
                                            value={getNestedValue(formData, field.name) || ''}
                                            onChange={(value) => setFormData(prev => setNestedValue(prev, field.name, value))}
                                            modules={quillModules}
                                        />
                                    )}
                                </div>
                            ) : field.type === 'checkbox' ? (
                                <input
                                    type="checkbox"
                                    checked={getNestedValue(formData, field.name) || false}
                                    onChange={e => setFormData(prev => setNestedValue(prev, field.name, e.target.checked))}
                                    style={{ width: 'auto', marginRight: '1rem' }}
                                />
                            ) : field.type === 'number' ? (
                                <input
                                    type="number"
                                    value={getNestedValue(formData, field.name) || ''}
                                    onChange={e => {
                                        const val = e.target.value === '' ? '' : Number(e.target.value);
                                        setFormData(prev => setNestedValue(prev, field.name, val));
                                    }}
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    value={getNestedValue(formData, field.name) || ''}
                                    onChange={e => setFormData(prev => setNestedValue(prev, field.name, e.target.value))}
                                    style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                                >
                                    <option value="">Select...</option>
                                    {field.options?.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type || 'text'}
                                    value={getNestedValue(formData, field.name) || ''}
                                    onChange={e => {
                                        const val = e.target.value;
                                        setFormData(prev => setNestedValue(prev, field.name, val));
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Create'}</button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setFormData({}); }} className="btn-secondary">Cancel</button>
                        )}
                    </div>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3>Existing Items</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>ID</th>
                            <th style={{ padding: '1rem' }}>Name/Title</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>{item._id.substring(item._id.length - 6)}</td>
                                <td style={{ padding: '1rem' }}>{item.title || item.name || item.company}</td>
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

export default ContentManager;
