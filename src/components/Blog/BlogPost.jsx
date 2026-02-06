import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Share2, Facebook } from 'lucide-react';
import './Blog.css';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('BlogPost mounted, ID:', id);
        if (id) {
            // Now using the getById endpoint which also increments visits
            fetch(`http://localhost:5000/api/blog/${id}`)
                .then(res => {
                    console.log('Fetch response status:', res.status);
                    if (!res.ok) throw new Error('Post not found');
                    return res.json();
                })
                .then(data => {
                    console.log('Fetched data:', data);
                    setPost(data);
                    setLoading(false);
                    // Dynamic SEO
                    document.title = `${data.title} | Personal Portfolio`;
                    document.querySelector('meta[name="description"]')?.setAttribute('content', data.excerpt);
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="blog-post-page section-padding">
                <div className="container"><h2>Loading...</h2></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="blog-post-page section-padding">
                <div className="container">
                    <h2>Post not found</h2>
                    <Link to="/" className="btn-secondary">Go Home</Link>
                </div>
            </div>
        );
    }

    const shareUrl = window.location.href;

    return (
        <div className="blog-post-page section-padding">
            <div className="container">
                <Link to="/blog" className="back-link">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <article className="blog-full-article glass-panel">
                    <div className="article-header">
                        <div className="blog-meta">
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.readTime || '5 min read'}</span>
                            <span>•</span>
                            <span>{post.visits || 0} visits</span>
                        </div>
                        <h1>{post.title}</h1>
                        <div className="tags">
                            {post.tags && post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                        </div>
                    </div>

                    <div className="article-content">
                        <p className="lead">{post.excerpt}</p>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        {/* Note: In a real app we would use a markdown renderer here, keeping it simple for now */}
                    </div>

                    <div className="article-footer">
                        <h3>Share this article</h3>
                        <div className="share-buttons">
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-btn linkedin"
                            >
                                <Linkedin size={20} /> LinkedIn
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-btn facebook"
                            >
                                <Facebook size={20} /> Facebook
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="share-btn twitter"
                            >
                                <Twitter size={20} /> Twitter
                            </a>
                            <button
                                className="share-btn instagram"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert("Link copied to clipboard!");
                                    navigator.clipboard.writeText(shareUrl);
                                }}
                            >
                                <Share2 size={20} /> Copy Link
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
