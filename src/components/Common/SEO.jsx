import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = "Veerapandi Lakshmanan - Full Stack Developer | Blockchain & Web3 Developer | AI Enthusiast",
    description = "Portfolio of Veerapandi Lakshmanan,  I am a Full Stack Developer with over five years of experience, including more than two years in Blockchain/Web3 development. I specialize in designing scalable backend architectures, REST APIs, orderbook trading systems, and cloud-based SaaS platforms.",
    keywords = "Veerapandi Lakshmanan, Full Stack Developer, React, Frontend, Backend, Blockchain, Web3, SaaS, SaaS Platform, Orderbook Trading System, REST API, Backend Architecture",
    image = "https://veerapandi-dev.vercel.app/assets/og-image.png",
    url = window.location.href,
    type = "website"
}) => {
    const siteTitle = "Veerapandi Lakshmanan";

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Veerapandi Lakshmanan",
        "jobTitle": "Full Stack Developer",
        "url": "https://veerapandi-dev.vercel.app",
        "sameAs": [
            "https://github.com/VEERAPANDI",
            "https://www.linkedin.com/in/veerapandi-l-520596111",
            "https://twitter.com/veerapandi97",
            "veerapandideveloper@gmail.com"
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
