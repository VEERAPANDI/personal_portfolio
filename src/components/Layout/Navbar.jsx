import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Layout.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <div className="nav-center-wrapper">
                    <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                        <img src="/assets/profile1.png" alt="VP" className="nav-logo-img" />
                        <span>VP</span>
                    </Link>

                    <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                        <a href="/#about" onClick={() => setIsOpen(false)}>About</a>
                        <a href="/#skill" onClick={() => setIsOpen(false)}>Skill</a>
                        <a href="/#experience" onClick={() => setIsOpen(false)}>Experience</a>
                        <a href="/#projects" onClick={() => setIsOpen(false)}>Projects</a>
                        <Link to="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
                        <a href="/#contact" onClick={() => setIsOpen(false)}>Contact</a>
                    </div>
                </div>

                <button
                    className={`mobile-toggle ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
