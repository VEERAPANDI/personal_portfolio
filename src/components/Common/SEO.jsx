import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = "Veerapandi Lakshmanan | Senior Web Application Developer",
    description = "Portfolio of Veerapandi Lakshmanan, a Senior Web Application Developer specializing in building scalable and interactive digital products.",
    keywords = "Veerapandi Lakshmanan, Web Developer, React, Frontend, Backend, Agent System, Senior Developer",
    image = "/assets/og-image.png", // Assuming an image exists or will be added
    url = window.location.href,
    type = "website"
}) => {
    const siteTitle = "Veerapandi Lakshmanan";

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Veerapandi Lakshmanan",
        "jobTitle": "Senior Web Application Developer",
        "url": "https://veerapandi-dev.vercel.app", // Update with production URL
        "sameAs": [
            "https://github.com/veerapandi", // Placeholder
            "https://linkedin.com/in/veerapandi" // Placeholder
        ],
        "description": description
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Veerapandi Lakshmanan" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* AI Crawlers & Robots */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            <meta name="bingbot" content="index, follow" />

            {/* Canonical Link */}
            <link rel="canonical" href={url} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;
