import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Sections.css';

const Skills = () => {
    const defaultLogos = [
        { name: 'Laravel', url: 'https://cdn.worldvectorlogo.com/logos/laravel-2.svg' },
        { name: 'HTML', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg' },
        { name: 'CSS', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg' },
        { name: 'JS', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg' },
        { name: 'Node js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
        { name: 'React js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
        { name: 'next js', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' },
        { name: 'mysql', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original.svg' },
        { name: 'redis', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg' },
        { name: 'mongo db', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg' },
        { name: 'pgsql', url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg' }
    ];

    const [skills, setSkills] = useState(defaultLogos);
    const [activeIndex, setActiveIndex] = useState(0);

    const scroll = (direction) => {
        const wrapper = document.getElementById('skills-slider-wrapper');
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
        <section id="skill" className="section-padding">
            <div className="container">
                <h2 className="section-title">Technical Expertise</h2>
                <div className="slider-container">
                    <button className="slider-arrow left" onClick={() => scroll('left')}>
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        id="skills-slider-wrapper"
                        className="slider-wrapper"
                        onScroll={handleScroll}
                    >
                        {skills.map((skill, index) => (
                            <div key={index} className="slider-item">
                                <div className="modern-card" style={{ height: '180px' }}>
                                    <div className="modern-card-content">
                                        <h3>{skill.name}</h3>
                                        <p>Expertise in {skill.name} development.</p>
                                        <button className="btn-join">Learn More</button>
                                    </div>
                                    <img
                                        src={skill.url}
                                        alt={skill.name}
                                        className="modern-card-image"
                                        style={{ width: '60px', height: '60px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="slider-arrow right" onClick={() => scroll('right')}>
                        <ChevronRight size={20} />
                    </button>

                    <div className="slider-dots">
                        {Array.from({ length: Math.ceil(skills.length / 3) || 1 }).map((_, index) => (
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

export default Skills;
