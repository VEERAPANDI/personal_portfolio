import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import Navbar from './components/Layout/Navbar'
import Footer from './components/Layout/Footer'
import Hero from './components/Sections/Hero'
import About from './components/Sections/About'
import Skills from './components/Sections/Skills'
import Experience from './components/Sections/Experience'
import Portfolio from './components/Sections/Portfolio'
import BlogSection from './components/Sections/BlogSection'
import Contact from './components/Sections/Contact'
import Newsletter from './components/Sections/Newsletter'
import AgentSystem from './components/Agent/AgentSystem'
import BlogPage from './components/Blog/BlogPage'
import BlogPost from './components/Blog/BlogPost'
import Login from './components/Admin/Login'
import Dashboard from './components/Admin/Dashboard'
import { ProjectManager, SkillManager, BlogManager, ExperienceManager } from './components/Admin/Managers'
import NewsletterManager from './components/Admin/NewsletterManager'
import ContactManager from './components/Admin/ContactManager'
import ResumeDownloadManager from './components/Admin/ResumeDownloadManager'

import PageTransition from './components/Layout/PageTransition'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <PageTransition>
                        <Hero />
                        <About />
                        <Skills />
                        <Experience />
                        <Portfolio />
                        <BlogSection />
                        <Newsletter />
                        <Contact />
                    </PageTransition>
                } />
                <Route path="/blog" element={<PageTransition><BlogPage /></PageTransition>} />
                <Route path="/blog/:id" element={<PageTransition><BlogPost /></PageTransition>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/admin/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/admin/projects" element={<PageTransition><ProjectManager /></PageTransition>} />
                <Route path="/admin/skills" element={<PageTransition><SkillManager /></PageTransition>} />
                <Route path="/admin/experience" element={<PageTransition><ExperienceManager /></PageTransition>} />
                <Route path="/admin/blogs" element={<PageTransition><BlogManager /></PageTransition>} />
                <Route path="/admin/newsletter" element={<PageTransition><NewsletterManager /></PageTransition>} />
                <Route path="/admin/contacts" element={<PageTransition><ContactManager /></PageTransition>} />
                <Route path="/admin/resume-downloads" element={<PageTransition><ResumeDownloadManager /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <title>Veerapandi Lakshmanan | Senior Web Application Developer</title>
                <meta name="description" content="Portfolio of Veerapandi Lakshmanan, a Senior Web Application Developer specializing in building scalable and interactive digital products." />
            </Helmet>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <main>
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                    <AgentSystem />
                </div>
            </Router>
        </HelmetProvider>
    )
}

export default App
