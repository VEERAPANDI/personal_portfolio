import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Zap, Briefcase, Code, FileText, Mail, FileDown } from 'lucide-react';
import './Agent.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const QUICK_ACTIONS = [
    { label: 'Skills', icon: Code, message: 'What are your skills?' },
    { label: 'Projects', icon: Zap, message: 'Show me your projects' },
    { label: 'Experience', icon: Briefcase, message: 'Tell me about your experience' },
    { label: 'Blog', icon: FileText, message: 'Any blog posts?' },
    { label: 'Resume', icon: FileDown, message: 'Download resume' },
    { label: 'Contact', icon: Mail, message: 'How to contact you?' },
];

const AgentSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! 👋 I'm the AI assistant for **Veerapandi's** portfolio. Ask me anything or tap a quick action below!",
            sender: 'agent',
            type: 'greeting'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async (messageText) => {
        if (!messageText.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetch(`${API_URL}/api/agent/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText })
            });

            const data = await res.json();

            // Handle resume download
            if (data.type === 'resume') {
                // Track download
                fetch(`${API_URL}/api/resume/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'agent' }),
                }).catch(err => console.error('Error tracking download:', err));

                window.open('/assets/resume.pdf', '_blank');
            }

            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'agent',
                type: data.type,
                data: data.data
            }]);
        } catch (err) {
            console.error('Agent error:', err);
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting right now. Please try again! 🔧",
                sender: 'agent',
                type: 'error'
            }]);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleQuickAction = (action) => {
        sendMessage(action.message);
    };

    /**
     * Render rich content based on message type and data
     */
    const renderMessageContent = (msg) => {
        // Format bold text marked with **
        const formatText = (text) => {
            if (!text) return '';
            const parts = text.split(/(\*\*[^*]+\*\*)/g);
            return parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i}>{part.slice(2, -2)}</strong>;
                }
                return part;
            });
        };

        // Render text with line breaks
        const renderFormattedText = (text) => {
            return text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                    {formatText(line)}
                    {i < text.split('\n').length - 1 && <br />}
                </React.Fragment>
            ));
        };

        // Skills — render as badges
        if (msg.type === 'skills' && msg.data) {
            return (
                <div className="agent-rich-content">
                    <p className="rich-intro">{formatText("Here are the technical skills:")}</p>
                    <div className="skill-badges">
                        {msg.data.map((skill, i) => (
                            <span key={i} className={`skill-badge level-${skill.level?.toLowerCase()}`}>
                                {skill.name}
                                <span className="badge-level">{skill.level}</span>
                            </span>
                        ))}
                    </div>
                </div>
            );
        }

        // Projects — render as mini cards
        if (msg.type === 'projects' && msg.data) {
            return (
                <div className="agent-rich-content">
                    <p className="rich-intro">{formatText(`Here are **${msg.data.length}** featured projects:`)}</p>
                    <div className="project-cards">
                        {msg.data.map((project, i) => (
                            <div key={i} className="mini-project-card">
                                <div className="project-card-header">
                                    <Zap size={14} />
                                    <strong>{project.title}</strong>
                                </div>
                                <p className="project-card-desc">{project.description}</p>
                                {project.tags && project.tags.length > 0 && (
                                    <div className="project-tags">
                                        {project.tags.map((tag, j) => (
                                            <span key={j} className="project-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                                        View Project →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Experience — render as timeline
        if (msg.type === 'experience' && msg.data) {
            return (
                <div className="agent-rich-content">
                    <p className="rich-intro">{formatText("Professional journey:")}</p>
                    <div className="experience-timeline">
                        {msg.data.map((exp, i) => (
                            <div key={i} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-content">
                                    <strong>{exp.role}</strong>
                                    <span className="timeline-company">@ {exp.company}</span>
                                    <span className="timeline-period">
                                        {exp.workingYear || 'Current'}
                                    </span>
                                    {exp.description && <p className="timeline-desc">{exp.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Blogs — render as article list
        if (msg.type === 'blogs' && msg.data) {
            return (
                <div className="agent-rich-content">
                    <p className="rich-intro">{formatText("Latest blog posts:")}</p>
                    <div className="blog-list">
                        {msg.data.map((blog, i) => (
                            <a key={i} href={`/blog/${blog.slug}`} className="blog-item">
                                <div className="blog-item-header">
                                    <FileText size={14} />
                                    <strong>{blog.title}</strong>
                                </div>
                                <p className="blog-excerpt">{blog.excerpt}</p>
                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="blog-tags">
                                        {blog.tags.map((tag, j) => (
                                            <span key={j} className="blog-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
            );
        }

        // Default text rendering with markdown-like formatting
        return <div className="agent-text-content">{renderFormattedText(msg.text)}</div>;
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                className={`agent-trigger ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
                id="agent-trigger-btn"
            >
                <div className="trigger-pulse"></div>
                <Sparkles size={24} />
                <span className="tooltip">Ask AI Agent</span>
            </button>

            {/* Agent Chat Interface */}
            <div className={`agent-interface ${isOpen ? 'open' : ''}`} id="agent-chat-window">
                {/* Header */}
                <div className="agent-header">
                    <div className="agent-title">
                        <div className="agent-avatar">
                            <Bot size={18} />
                        </div>
                        <div className="agent-title-text">
                            <span className="agent-name">Portfolio Agent</span>
                            <span className="agent-status">
                                <span className="status-dot"></span>
                                Online
                            </span>
                        </div>
                    </div>
                    <button className="close-agent" onClick={() => setIsOpen(false)} id="agent-close-btn">
                        <X size={18} />
                    </button>
                </div>

                {/* Messages */}
                <div className="agent-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            {msg.sender === 'agent' && (
                                <div className="message-avatar">
                                    <Bot size={14} />
                                </div>
                            )}
                            <div className="message-bubble">
                                {renderMessageContent(msg)}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="message agent">
                            <div className="message-avatar">
                                <Bot size={14} />
                            </div>
                            <div className="message-bubble typing-indicator">
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                                <span className="typing-dot"></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    {QUICK_ACTIONS.map((action, i) => (
                        <button
                            key={i}
                            className="quick-chip"
                            onClick={() => handleQuickAction(action)}
                            disabled={isTyping}
                        >
                            <action.icon size={12} />
                            {action.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <form className="agent-input" onSubmit={handleSend}>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isTyping}
                        id="agent-msg-input"
                    />
                    <button type="submit" disabled={isTyping || !input.trim()} id="agent-send-btn">
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </>
    );
};

export default AgentSystem;
