import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, ArrowRight } from 'lucide-react';
import './Blog.css';

const BlogPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/blog')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="blog-page section-padding">
            <div className="container">
                <h2 className="section-title">Latest Thoughts</h2>
                <div className="blog-grid">
                    {posts.map(post => (
                        <article key={post._id} className="blog-card glass-panel">
                            <div className="blog-content">
                                <div className="blog-meta">
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{post.readTime || '5 min read'}</span>
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="blog-footer">
                                    <div className="tags">
                                        {post.tags && post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                                    </div>
                                    <Link to={`/blog/${post.slug}`} className="read-more">
                                        Read More <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
