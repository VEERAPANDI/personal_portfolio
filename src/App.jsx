import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'

// Public Components
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Hero from './components/Sections/Hero'
import About from './components/Sections/About'
import Skills from './components/Sections/Skills'
import Experience from './components/Sections/Experience'
import Portfolio from './components/Sections/Portfolio'
import PersonalProjectsSection from './components/Sections/PersonalProjectsSection'
import BlogSection from './components/Sections/BlogSection'
import Contact from './components/Sections/Contact'
import Newsletter from './components/Sections/Newsletter'
import NotFound from './components/Sections/NotFound'
import AgentSystem from './components/Agent/AgentSystem'
import BlogPage from './components/Blog/BlogPage'
import BlogPost from './components/Blog/BlogPost'

// Admin Components (Lazy Loaded)
const Login = lazy(() => import('./components/Admin/Login'));
const Dashboard = lazy(() => import('./components/Admin/Dashboard'));
const ProjectManager = lazy(() => import('./components/Admin/Managers').then(module => ({ default: module.ProjectManager })));
const SkillManager = lazy(() => import('./components/Admin/Managers').then(module => ({ default: module.SkillManager })));
const BlogManager = lazy(() => import('./components/Admin/Managers').then(module => ({ default: module.BlogManager })));
const ExperienceManager = lazy(() => import('./components/Admin/Managers').then(module => ({ default: module.ExperienceManager })));
const NewsletterManager = lazy(() => import('./components/Admin/NewsletterManager'));
const ContactManager = lazy(() => import('./components/Admin/ContactManager'));
const ResumeDownloadManager = lazy(() => import('./components/Admin/ResumeDownloadManager'));
const PersonalProjectManager = lazy(() => import('./components/Admin/PersonalProjectManager'));

import PageTransition from './components/Layout/PageTransition'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import SEO from './components/Common/SEO'
import CookieBanner from './components/Common/CookieBanner'

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<div className="loading-screen section-padding"><div className="container"><h2>Loading...</h2></div></div>}>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={
                        <PageTransition>
                            <SEO />
                            <Hero />
                            <About />
                            <Skills />
                            <Experience />
                            <Portfolio />
                            <BlogSection />
                            <Newsletter />
                            <PersonalProjectsSection />
                            <Contact />
                        </PageTransition>
                    } />
                    <Route path="/blog" element={<PageTransition><SEO title="Blog | Veerapandi Lakshmanan" description="Read the latest articles on web development, AI, and software engineering by Veerapandi Lakshmanan." /><BlogPage /></PageTransition>} />
                    <Route path="/blog/:id" element={<PageTransition><SEO type="article" /><BlogPost /></PageTransition>} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<PageTransition><Login /></PageTransition>} />
                    <Route path="/admin/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                    <Route path="/admin/projects" element={<PageTransition><ProjectManager /></PageTransition>} />
                    <Route path="/admin/personal-projects" element={<PageTransition><PersonalProjectManager /></PageTransition>} />
                    <Route path="/admin/skills" element={<PageTransition><SkillManager /></PageTransition>} />
                    <Route path="/admin/experience" element={<PageTransition><ExperienceManager /></PageTransition>} />
                    <Route path="/admin/blogs" element={<PageTransition><BlogManager /></PageTransition>} />
                    <Route path="/admin/newsletter" element={<PageTransition><NewsletterManager /></PageTransition>} />
                    <Route path="/admin/contacts" element={<PageTransition><ContactManager /></PageTransition>} />
                    <Route path="/admin/resume-downloads" element={<PageTransition><ResumeDownloadManager /></PageTransition>} />

                    {/* 404 Catch All Route */}
                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}

function App() {
    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <div className="app-container">
                    <Navbar />
                    <main>
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                    <AgentSystem />
                    <CookieBanner />
                </div>
            </Router>
        </HelmetProvider>
    )
}

export default App
