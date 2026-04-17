import React, { useState, useEffect } from 'react';
import { Github, Star, Code2 } from 'lucide-react';
import './Sections.css';

const PersonalProjectsSection = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/personal-projects`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                } else {
                    console.error('Projects data is not an array:', data);
                    setProjects([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch personal projects:', err);
                setProjects([]);
            });
    }, []);

    return (
        <section id="personal-projects" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
            <div className="container">
                <h2 className="section-title">Personal Projects</h2>
                {projects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <p>No personal projects to display right now.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {projects.map((project) => (
                            <div key={project._id} className="modern-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <img
                                    src={project.featuredImage?.optimized_image_url || `https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=400&sig=${project._id}`}
                                    alt={project.title}
                                    className="modern-card-image"
                                    style={{ height: '200px', objectFit: 'cover', width: '100%' }}
                                />
                                <div className="modern-card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--accent-primary)' }}>{project.title}</h3>
                                        <Github size={20} color="var(--accent-primary)" />
                                    </div>
                                    <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, color: 'var(--text-secondary)' }}>
                                        {project.description || 'No description provided.'}
                                    </p>

                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#ccc' }}>
                                        {project.language && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Code2 size={16} />
                                                <span>{project.language}</span>
                                            </div>
                                        )}
                                        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Star size={16} fill="currentColor" color="gold" />
                                        <span>{project.stars || 0}</span>
                                    </div> */}
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, textAlign: 'center' }}>
                                            View Code
                                        </a>
                                        {project.homepage && (
                                            <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, textAlign: 'center' }}>
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PersonalProjectsSection;
