import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={
                            <>
                                <Hero />
                                <About />
                                <Skills />
                                <Experience />
                                <Portfolio />
                                <BlogSection />
                                <Newsletter />
                                <Contact />
                            </>
                        } />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:id" element={<BlogPost />} />

                        {/* Admin Routes */}
                        <Route path="/admin" element={<Login />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/projects" element={<ProjectManager />} />
                        <Route path="/admin/skills" element={<SkillManager />} />
                        <Route path="/admin/experience" element={<ExperienceManager />} />
                        <Route path="/admin/blogs" element={<BlogManager />} />
                        <Route path="/admin/newsletter" element={<NewsletterManager />} />
                        <Route path="/admin/contacts" element={<ContactManager />} />
                        <Route path="/admin/resume-downloads" element={<ResumeDownloadManager />} />
                    </Routes>
                </main>
                <Footer />
                <AgentSystem />
            </div>
        </Router>
    )
}

export default App
