import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Sections.css';

const BlogSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        fetch('http://localhost:5000/api/blog')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBlogs(data.slice(0, 5));
                } else {
                    console.error('Blog data is not an array:', data);
                    setBlogs([]);
                }
            })
            .catch(err => {
                console.error('Failed to fetch blogs:', err);
                setBlogs([]);
            });
    }, []);

    const scroll = (direction) => {
        const wrapper = document.getElementById('blog-slider-wrapper');
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
        <section id="blog" className="section-padding">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>Latest Stories</h2>
                    <Link to="/blog" className="link-arrow">Read All Posts &rarr;</Link>
                </div>

                <div className="slider-container">
                    <button className="slider-arrow left" onClick={() => scroll('left')}>
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        id="blog-slider-wrapper"
                        className="slider-wrapper"
                        onScroll={handleScroll}
                    >
                        {blogs.map((blog) => (
                            <div key={blog._id} className="slider-item">
                                <div className="modern-card">
                                    <div className="modern-card-content">
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>{blog.title}</h3>
                                        <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{blog.excerpt}</p>
                                        <Link to={`/blog/${blog.slug}`} className="btn-join">
                                            Read Article
                                        </Link>
                                    </div>
                                    <img
                                        src={blog.image || `https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=400&sig=${blog._id}`}
                                        alt={blog.title}
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
                        {Array.from({ length: Math.ceil(blogs.length / 3) || 1 }).map((_, index) => (
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

export default BlogSection;
