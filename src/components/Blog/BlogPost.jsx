import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Linkedin, Twitter, Share2, Facebook } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import './Blog.css';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('BlogPost mounted, ID:', id);
        if (id) {
            // Now using the getById endpoint which also increments visits
            fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/blog/${id}`)
                .then(res => {
                    console.log('Fetch response status:', res.status);
                    if (!res.ok) throw new Error('Post not found');
                    return res.json();
                })
                .then(data => {
                    console.log('Fetched data:', data);
                    setPost(data);
                    setLoading(false);
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
    const siteUrl = window.location.origin;

    // SEO Configuration
    const seoTitle = post.seo?.metaTitle || post.title;
    const seoDescription = post.seo?.metaDescription || post.excerpt;
    const seoKeywords = post.seo?.metaKeywords || post.tags?.join(', ') || '';
    // Use featured image for OG image if available, fallback to default
    const ogImage = post.seo?.ogImage || post.featuredImage?.optimized_image_url || `${siteUrl}/assets/og-image.png`;
    const canonicalUrl = post.seo?.canonicalUrl || shareUrl;
    const robotsMeta = post.seo?.robotsMeta || 'index, follow';
    
    // Featured Image Configuration
    const featuredImage = post.featuredImage;
    const hasFeaturedImage = featuredImage?.optimized_image_url;

    // RAG Configuration for AI crawlers
    const ragEnabled = post.rag?.isEnabled !== false;
    const ragPriority = post.rag?.priority || 5;
    const ragCategory = post.rag?.category || 'general';

    // Structured data for the blog post
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": ogImage,
        "author": {
            "@type": "Person",
            "name": post.author || "Veerapandi Lakshmanan"
        },
        "publisher": {
            "@type": "Person",
            "name": "Veerapandi Lakshmanan",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/assets/og-image.png`
            }
        },
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt || post.createdAt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
        },
        "keywords": post.tags?.join(', '),
        "articleSection": ragCategory,
        "wordCount": post.content?.split(/\s+/).length || 0
    };

    return (
        <div className="blog-post-page section-padding">
            <Helmet>
                {/* Standard Meta Tags */}
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content={seoKeywords} />
                <meta name="author" content={post.author || "Veerapandi Lakshmanan"} />
                <meta name="robots" content={robotsMeta} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="article:published_time" content={post.createdAt} />
                <meta property="article:modified_time" content={post.updatedAt || post.createdAt} />
                <meta property="article:author" content={post.author || "Veerapandi Lakshmanan"} />
                {post.tags?.map(tag => (
                    <meta key={tag} property="article:tag" content={tag} />
                ))}

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
                <meta name="twitter:image" content={ogImage} />

                {/* AI Crawlers & RAG Configuration */}
                <meta name="ai-content-ranking" content={ragPriority} />
                <meta name="ai-content-category" content={ragCategory} />
                <meta name="ai-content-enabled" content={ragEnabled ? "true" : "false"} />
                
                {/* Specific AI Crawlers */}
                <meta name="googlebot" content={robotsMeta} />
                <meta name="bingbot" content={robotsMeta} />
                <meta name="anthropic-ai" content={ragEnabled ? "index" : "noindex"} />
                <meta name="openai" content={ragEnabled ? "index" : "noindex"} />
                <meta name="chatgpt" content={ragEnabled ? "index" : "noindex"} />
                <meta name="perplexity" content={ragEnabled ? "index" : "noindex"} />
                <meta name="cohere-ai" content={ragEnabled ? "index" : "noindex"} />
                <meta name="google-extended" content={ragEnabled ? "index" : "noindex"} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            </Helmet>

            <div className="container">
                <Link to="/blog" className="back-link">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>

                <article className="blog-full-article glass-panel" data-rag-enabled={ragEnabled} data-rag-priority={ragPriority} data-rag-category={ragCategory}>
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

                    {/* Featured Image with SEO & Performance Optimizations */}
                    {hasFeaturedImage && (
                        <figure className="featured-image-container">
                            <img
                                src={featuredImage.optimized_image_url}
                                alt={featuredImage.image_context_text || post.title}
                                loading="lazy"
                                width="800"
                                height="450"
                                className="featured-image"
                                srcSet={`
                                    ${featuredImage.optimized_image_url.replace('w=800', 'w=400')} 400w,
                                    ${featuredImage.optimized_image_url.replace('w=800', 'w=800')} 800w
                                `}
                                sizes="(max-width: 768px) 100vw, 800px"
                            />
                            {/* RAG-optimized caption for AI context */}
                            <figcaption className="image-caption">
                                {featuredImage.image_context_text && (
                                    <span className="image-context" data-rag-image-context={featuredImage.image_context_text}>
                                        {featuredImage.image_context_text}
                                    </span>
                                )}
                                {featuredImage.photographer && (
                                    <span className="photographer-credit">
                                        {' '}Photo by{' '}
                                        <a 
                                            href={featuredImage.photographer_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {featuredImage.photographer}
                                        </a>
                                        {' '}on Unsplash
                                    </span>
                                )}
                            </figcaption>
                        </figure>
                    )}

                    <div className="article-content">
                        <p className="lead">{post.excerpt}</p>
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
