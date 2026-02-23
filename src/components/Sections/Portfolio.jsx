import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Sections.css';

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`)
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
                console.error('Failed to fetch projects:', err);
                setProjects([]);
            });
    }, []);

    const scroll = (direction) => {
        const wrapper = document.getElementById('project-slider-wrapper');
        if (wrapper) {
            const scrollAmount = wrapper.clientWidth;
            wrapper.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.clientWidth;
        const index = Math.round(scrollLeft / width);
        setActiveIndex(index);
    };

    return (
        <section id="projects" className="section-padding">
            <div className="container">
                <h2 className="section-title">Personal Projects</h2>
                <div className="slider-container">
                    <button className="slider-arrow left" onClick={() => scroll('left')}>
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        id="project-slider-wrapper"
                        className="slider-wrapper"
                        onScroll={handleScroll}
                    >
                        {projects.map((project) => (
                            <div key={project._id} className="slider-item">
                                <div className="modern-card">
                                    <div className="modern-card-content">
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>{project.title}</h3>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '1.2rem' }}>{project.description}</p>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-join">
                                            Visit Project
                                        </a>
                                    </div>
                                    <img
                                        src={project.image || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400&sig=${project._id}`}
                                        alt={project.title}
                                        className="modern-card-image"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="slider-arrow right" onClick={() => scroll('right')}>
                        <ChevronRight size={20} />
                    </button>

                    <div className="slider-dots">
                        {Array.from({ length: Math.ceil(projects.length / 3) || 1 }).map((_, index) => (
                            <div
                                key={index}
                                className={`dot ${activeIndex === index ? 'active' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
