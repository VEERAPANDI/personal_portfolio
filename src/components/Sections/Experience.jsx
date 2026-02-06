import React, { useEffect, useState } from 'react';
import './Sections.css';

const Experience = () => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/experience');
                const data = await res.json();
                setExperiences(data);
            } catch (err) {
                console.error('Failed to fetch experience', err);
                setExperiences([]);
            }
        };
        fetchExperience();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    return (
        <section id="experience" className="section-padding">
            <div className="container">
                <h2 className="section-title">Professional Journey</h2>
                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <div key={exp._id} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content glass-panel">
                                <div className="timeline-header">
                                    <h3>{exp.role}</h3>
                                    <span className="timeline-date">{exp.workingYear || `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`}</span>
                                </div>
                                <div className="timeline-company">
                                    <a href={exp.companyWebsite || '#'} target="_blank" rel="noopener noreferrer">
                                        {exp.company}
                                    </a>
                                </div>
                                <p className="timeline-description">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="no-data-placeholder">
                            <p>Exploring new horizons and continuous learning.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Experience;
