import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, FileDown } from 'lucide-react';
import './Agent.css';

const AgentSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm the personal AI agent for this portfolio. Ask me anything about my skills, experience, or type 'download cv' to get my resume.", sender: 'agent' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const userInput = input.toLowerCase();
        setInput('');

        // Simulate Agent Response
        setTimeout(() => {
            let responseText = "I'm not sure about that. Try asking about 'skills', 'contact', or 'projects'.";

            if (userInput.includes('hello') || userInput.includes('hi')) {
                responseText = "Hello there! How can I help you today?";
            } else if (userInput.includes('skill') || userInput.includes('stack')) {
                responseText = knowledge.skills;
            } else if (userInput.includes('experience') || userInput.includes('job') || userInput.includes('work') || userInput.includes('about')) {
                responseText = knowledge.about;
            } else if (userInput.includes('contact') || userInput.includes('email')) {
                responseText = knowledge.contact;
            } else if (userInput.includes('download cv') || userInput.includes('resume')) {
                responseText = "Sure! Downloading my CV now...";

                // Track download
                fetch('http://localhost:5000/api/resume/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'agent' }),
                }).catch(err => console.error('Error tracking download:', err));

                // Initiate download - using window.open for better compatibility
                window.open('/assets/resume.pdf', '_blank');
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'agent' }]);
        }, 1000);
    };

    return (
        <>
            <button className={`agent-trigger ${isOpen ? 'hidden' : ''}`} onClick={() => setIsOpen(true)}>
                <Bot size={24} />
                <span className="tooltip">Ask AI Agent</span>
            </button>

            <div className={`agent-interface ${isOpen ? 'open' : ''}`}>
                <div className="agent-header">
                    <div className="agent-title">
                        <Bot size={20} />
                        <span>Personal Agent</span>
                    </div>
                    <button className="close-agent" onClick={() => setIsOpen(false)}>
                        <X size={18} />
                    </button>
                </div>

                <div className="agent-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form className="agent-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button type="submit">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </>
    );
};

export default AgentSystem;
