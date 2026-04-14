import React from 'react';
import './Sections.css';

const About = () => {
    return (
        <section id="about" className="section-padding">
            <div className="container about-container">
                <div className="about-grid">
                    <div className="about-image glass-panel">
                        <img src="/assets/profile.png" alt="Veerapandi" style={{ width: '100%', borderRadius: '12px' }} />
                    </div>
                    <div className="about-content">
                        <h2 className="section-title">About Me</h2>
                        <div className="about-text">
                            <p className="about-paragraph">
                                A self-motivated and results-driven <span className="highlight-text">Web Developer</span> with 5 years of comprehensive experience, including 2 years specializing in Blockchain development.
                            </p>
                            <p className="about-paragraph">
                                Proficient in full-stack web technologies and capable of designing and deploying cutting-edge crypto applications. Proven expertise in building sophisticated platforms such as <span className="highlight-text">Orderbook systems, and secure payment gateway integrations</span>.
                            </p>
                            {/* <p className="about-paragraph">
                                Seeking an opportunity to leverage advanced skills and leadership to deliver high-impact web and blockchain solutions.
                            </p> */}
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>5+</h3>
                                <p>Years of Experience</p>
                            </div>
                            <div className="stat-card">
                                <h3>10+</h3>
                                <p>Projects Completed</p>
                            </div>
                            <div className="stat-card">
                                <h3>AI</h3>
                                <p>Tech Enthusiast</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
