import React, { useState } from 'react';
import UnsplashImagePicker from './UnsplashImagePicker';

/**
 * Example: Using UnsplashImagePicker in a Blog Editor
 * 
 * This component demonstrates how to integrate the UnsplashImagePicker
 * into your blog content management system.
 */
const BlogEditorWithImagePicker = () => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featuredImage: null
    });

    const handleImageSelect = (imageData) => {
        setFormData(prev => ({
            ...prev,
            featuredImage: imageData
        }));
    };

    const handleImageClear = () => {
        setFormData(prev => ({
            ...prev,
            featuredImage: null
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prepare data for API
        const blogData = {
            ...formData,
            // The featuredImage object is ready to be stored in MongoDB
            featuredImage: formData.featuredImage || {
                optimized_image_url: '',
                image_context_text: ''
            }
        };

        console.log('Submitting blog post:', blogData);
        
        // API call would go here
        // const response = await fetch('/api/blogs', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(blogData)
        // });
    };

    return (
        <form onSubmit={handleSubmit} className="blog-editor">
            <div className="form-group">
                <label>Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </div>

            <div className="form-group">
                <label>Slug</label>
                <input
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                />
            </div>

            <div className="form-group">
                <label>Excerpt</label>
                <textarea
                    value={formData.excerpt}
                    onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                />
            </div>

            {/* Featured Image Section with Unsplash Picker */}
            <div className="form-group">
                <label>Featured Image</label>
                <UnsplashImagePicker
                    onImageSelect={handleImageSelect}
                    selectedImage={formData.featuredImage}
                    onClear={handleImageClear}
                    placeholder="Search for featured images..."
                />
            </div>

            <button type="submit" className="btn-primary">
                Save Blog Post
            </button>
        </form>
    );
};

export default BlogEditorWithImagePicker;


/**
 * ============================================================================
 * EXAMPLE 1: Stored Blog Post Object (as saved in MongoDB)
 * ============================================================================
 * 
 * When a blog post is saved with a selected Unsplash image, the document
 * in the database will look like this:
 */

export const exampleBlogPost = {
    _id: "507f1f77bcf86cd799439011",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    excerpt: "Learn the best practices for building scalable and maintainable React applications with modern architecture patterns.",
    content: "<p>React has become the go-to library for building modern web applications...</p>",
    tags: ["react", "javascript", "architecture", "frontend"],
    visits: 1250,
    author: "Veerapandi Lakshmanan",
    isPublished: true,
    
    // Featured Image with SEO & RAG optimization
    featuredImage: {
        // Optimized URL with Imgix parameters (800px width, 80% quality)
        optimized_image_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        
        // Context text for RAG - extracted from alt_description or description
        image_context_text: "React code on a computer screen with modern IDE",
        
        // Additional metadata (optional, for reference)
        original_url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
        unsplash_id: "photo-1633356122544-f134324a6cee",
        photographer: "Ferenc Almasi",
        photographer_url: "https://unsplash.com/@flowforfrank"
    },
    
    // SEO Configuration
    seo: {
        metaTitle: "Building Scalable React Applications | Best Practices Guide",
        metaDescription: "Learn proven patterns for building scalable React apps with clean architecture.",
        metaKeywords: "react, scalability, architecture, frontend development",
        ogImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        canonicalUrl: "https://yourdomain.com/blog/building-scalable-react-applications",
        robotsMeta: "index, follow"
    },
    
    // RAG Configuration
    rag: {
        isEnabled: true,
        priority: 8,
        category: "technology",
        contextWindow: 2000,
        embeddingModel: "text-embedding-3-small"
    },
    
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-20T14:22:00.000Z"
};


/**
 * ============================================================================
 * EXAMPLE 2: Rendered Image Component
 * ============================================================================
 * 
 * When rendering the blog post, use the optimized image URL and context text:
 */

export const ExampleRenderedImage = () => {
    const post = exampleBlogPost;
    
    return (
        <article className="blog-post">
            {/* Featured Image with all SEO & Performance optimizations */}
            {post.featuredImage?.optimized_image_url && (
                <figure className="featured-image">
                    <img
                        src={post.featuredImage.optimized_image_url}
                        alt={post.featuredImage.image_context_text}
                        loading="lazy"
                        width="800"
                        height="600"
                        // Optional: Responsive srcSet for different screen sizes
                        srcSet={`
                            ${post.featuredImage.optimized_image_url.replace('w=800', 'w=400')} 400w,
                            ${post.featuredImage.optimized_image_url.replace('w=800', 'w=800')} 800w
                        `}
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <figcaption>
                        Photo by <a href={post.featuredImage.photographer_url} target="_blank" rel="noopener noreferrer">
                            {post.featuredImage.photographer}
                        </a> on Unsplash
                    </figcaption>
                </figure>
            )}
            
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
};


/**
 * ============================================================================
 * EXAMPLE 3: RAG-Optimized Content Retrieval
 * ============================================================================
 * 
 * When retrieving blog content for AI/RAG systems, include the image context:
 */

export const getRAGOptimizedContent = (post) => {
    // Build a comprehensive document that includes image context
    const document = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        tags: post.tags,
        
        // Include image context for AI understanding
        mediaContext: post.featuredImage?.image_context_text 
            ? `Featured image: ${post.featuredImage.image_context_text}`
            : null,
        
        // Full text for embedding (includes image description)
        fullTextForEmbedding: `
            Title: ${post.title}
            Excerpt: ${post.excerpt}
            Content: ${post.content.replace(/<[^>]*>/g, '')}
            ${post.featuredImage?.image_context_text 
                ? `Featured Image Description: ${post.featuredImage.image_context_text}` 
                : ''}
            Tags: ${post.tags?.join(', ')}
        `.trim()
    };
    
    return document;
};


/**
 * ============================================================================
 * EXAMPLE 4: Complete HTML Output
 * ============================================================================
 * 
 * The final rendered HTML img tag will look like this:
 * 
 * <img 
 *   src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"
 *   alt="React code on a computer screen with modern IDE"
 *   loading="lazy"
 *   width="800"
 *   height="600"
 *   srcset="
 *     https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80 400w,
 *     https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80 800w
 *   "
 *   sizes="(max-width: 768px) 100vw, 800px"
 * >
 * 
 * Benefits:
 * - 800px max width prevents loading huge original images
 * - 80% quality provides good visual quality with smaller file size
 * - lazy loading improves initial page load performance
 * - width/height attributes prevent layout shift (CLS)
 * - srcSet provides responsive images for different devices
 * - alt text from image_context_text improves accessibility and SEO
 */


/**
 * ============================================================================
 * Environment Variables Setup
 * ============================================================================
 * 
 * Add to your .env file:
 * 
 * # Unsplash API Configuration
 * VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
 * 
 * Get your free API key at: https://unsplash.com/developers
 */
