import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import './UnsplashImagePicker.css';

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Imgix optimization parameters
const IMGIX_PARAMS = '&w=800&q=80';

/**
 * UnsplashImagePicker Component
 * 
 * Features:
 * - Search and select images from Unsplash API
 * - Automatically appends Imgix parameters for optimization
 * - Extracts alt_description/description for RAG context
 * - Returns optimized URL and context text for database storage
 */
const UnsplashImagePicker = ({ 
    onImageSelect, 
    selectedImage = null, 
    onClear,
    placeholder = "Search for images..."
}) => {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Debounced search function
    const searchImages = useCallback(async (searchQuery) => {
        if (!searchQuery.trim() || !UNSPLASH_ACCESS_KEY) {
            setImages([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=12`,
                {
                    headers: {
                        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch images from Unsplash');
            }

            const data = await response.json();
            setImages(data.results);
        } catch (err) {
            setError(err.message);
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) {
                searchImages(query);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, searchImages]);

    /**
     * Extract image context text for RAG optimization
     * Falls back through: alt_description -> description -> default
     */
    const extractImageContext = (image) => {
        if (image.alt_description && image.alt_description.trim()) {
            return image.alt_description.trim();
        }
        if (image.description && image.description.trim()) {
            return image.description.trim();
        }
        return 'Unsplash image';
    };

    /**
     * Build optimized image URL with Imgix parameters
     * Unsplash uses Imgix, so we can append parameters directly
     */
    const buildOptimizedUrl = (imageUrl) => {
        // Check if URL already has query parameters
        const separator = imageUrl.includes('?') ? '&' : '?';
        return `${imageUrl}${separator}${IMGIX_PARAMS}`;
    };

    /**
     * Handle image selection
     * Returns optimized URL and context text for storage
     */
    const handleImageSelect = (image) => {
        const optimizedUrl = buildOptimizedUrl(image.urls.regular);
        const contextText = extractImageContext(image);

        const imageData = {
            optimized_image_url: optimizedUrl,
            image_context_text: contextText,
            // Additional metadata for reference
            original_url: image.urls.regular,
            unsplash_id: image.id,
            photographer: image.user?.name || 'Unknown',
            photographer_url: image.user?.links?.html || '',
            width: image.width,
            height: image.height
        };

        onImageSelect(imageData);
        setIsOpen(false);
        setQuery('');
        setImages([]);
    };

    const handleClear = () => {
        if (onClear) {
            onClear();
        }
    };

    return (
        <div className="unsplash-picker">
            {/* Selected Image Preview */}
            {selectedImage ? (
                <div className="selected-image-preview">
                    <div className="preview-container">
                        <img 
                            src={selectedImage.optimized_image_url} 
                            alt={selectedImage.image_context_text}
                            loading="lazy"
                            width="400"
                            height="300"
                        />
                        <div className="preview-overlay">
                            <span className="context-text" title={selectedImage.image_context_text}>
                                {selectedImage.image_context_text}
                            </span>
                            <button 
                                type="button" 
                                className="clear-btn"
                                onClick={handleClear}
                                aria-label="Remove image"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="image-meta">
                        <small>Optimized: 800px width, 80% quality</small>
                    </div>
                </div>
            ) : (
                /* Search Trigger */
                <div className="picker-trigger">
                    <button
                        type="button"
                        className="trigger-btn"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <ImageIcon size={20} />
                        <span>Select from Unsplash</span>
                    </button>
                </div>
            )}

            {/* Search Modal/Dropdown */}
            {isOpen && (
                <div className="picker-modal">
                    <div className="picker-header">
                        <div className="search-input-wrapper">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                                className="search-input"
                                autoFocus
                            />
                            {query && (
                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={() => {
                                        setQuery('');
                                        setImages([]);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        <button
                            type="button"
                            className="close-modal"
                            onClick={() => {
                                setIsOpen(false);
                                setQuery('');
                                setImages([]);
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="picker-body">
                        {/* Loading State */}
                        {loading && (
                            <div className="loading-state">
                                <Loader2 size={32} className="spinner" />
                                <p>Searching Unsplash...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="error-state">
                                <p>{error}</p>
                                <small>Please check your Unsplash API key configuration</small>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && images.length === 0 && query && (
                            <div className="empty-state">
                                <p>No images found for "{query}"</p>
                            </div>
                        )}

                        {/* Initial State */}
                        {!loading && !error && images.length === 0 && !query && (
                            <div className="initial-state">
                                <ImageIcon size={48} />
                                <p>Search for images on Unsplash</p>
                                <small>Images will be optimized for web (800px, 80% quality)</small>
                            </div>
                        )}

                        {/* Image Grid */}
                        {!loading && !error && images.length > 0 && (
                            <div className="image-grid">
                                {images.map((image) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        className="image-item"
                                        onClick={() => handleImageSelect(image)}
                                        title={extractImageContext(image)}
                                    >
                                        <img
                                            src={image.urls.small}
                                            alt={extractImageContext(image)}
                                            loading="lazy"
                                            width="200"
                                            height="150"
                                        />
                                        <div className="image-overlay">
                                            <Check size={24} />
                                        </div>
                                        <div className="photographer">
                                            by {image.user?.name || 'Unknown'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="picker-footer">
                        <small>
                            Images powered by <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>
                            {' '}• Auto-optimized with Imgix
                        </small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnsplashImagePicker;
