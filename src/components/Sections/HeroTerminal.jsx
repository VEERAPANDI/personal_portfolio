import React, { useState, useEffect, useRef } from 'react';
import './Sections.css';

const knowledge = {
    skills: "My core stack includes React, Node.js, Express, MongoDB, Postgres, and Python for AI Agent integrations.",
    about: "I'm a Senior Web Application Developer with over 5 years of experience building scalable products and AI solutions.",
    contact: "You can reach me at contact@example.com or use the contact form below!"
};

const HeroTerminal = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isInitializing, setIsInitializing] = useState(true);
    const terminalBodyRef = useRef(null);

    // Initial animation
    useEffect(() => {
        const initText = [
            "> Accessing Veerapandi's Server...",
            "> Initializing Agent System...",
            "> Loading skills and experience...",
            "> System Ready.",
            "Type 'help', 'skills', 'experience', or 'download cv' to interact."
        ];

        let i = 0;
        const initInterval = setInterval(() => {
            if (i < initText.length) {
                setMessages(prev => [...prev, { id: Date.now() + i, text: initText[i], sender: 'system' }]);
                i++;
            } else {
                setIsInitializing(false);
                clearInterval(initInterval);
            }
        }, 600);
        return () => clearInterval(initInterval);
    }, []);

    const scrollToBottom = () => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTo({
                top: terminalBodyRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleCommand = (e) => {
        e.preventDefault();
        if (!input.trim() || isInitializing) return;

        const currentInput = input;
        setInput('');

        // Add user command
        setMessages(prev => [...prev, { id: Date.now(), text: `> ${currentInput}`, sender: 'user' }]);

        const userInput = currentInput.toLowerCase();

        // Process Agent Response
        setTimeout(() => {
            let responseText = "Command not recognized. Try 'skills', 'experience', 'contact', or 'download cv'.";

            if (userInput.includes('help')) {
                responseText = "Available commands: skills, experience, contact, download cv, clear";
            } else if (userInput.includes('hello') || userInput.includes('hi')) {
                responseText = "Hello there! How can I help you today?";
            } else if (userInput.includes('clear')) {
                setMessages([]);
                return;
            } else if (userInput.includes('skill') || userInput.includes('stack')) {
                responseText = knowledge.skills;
            } else if (userInput.includes('experience') || userInput.includes('job') || userInput.includes('work') || userInput.includes('about')) {
                responseText = knowledge.about;
            } else if (userInput.includes('contact') || userInput.includes('email')) {
                responseText = knowledge.contact;
            } else if (userInput.includes('download cv') || userInput.includes('resume')) {
                responseText = "Downloading CV...";
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/resume/track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ source: 'hero_terminal' }),
                }).catch(err => console.error('Error tracking download:', err));
                window.open('/assets/resume.pdf', '_blank');
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'agent' }]);
        }, 500);
    };

    return (
        <div className="hero-terminal-container">
            <div className="terminal-header">
                <div className="terminal-button red"></div>
                <div className="terminal-button yellow"></div>
                <div className="terminal-button green"></div>
                <div className="terminal-title">agent-system ~ bash</div>
            </div>
            <div className="terminal-body interactive-terminal" ref={terminalBodyRef} onClick={() => document.getElementById('terminal-input').focus()}>
                <div className="terminal-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`terminal-msg ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                {!isInitializing && (
                    <form className="terminal-input-row" onSubmit={handleCommand}>
                        <span className="terminal-prompt">&gt;</span>
                        <input
                            id="terminal-input"
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            autoComplete="off"
                        />
                    </form>
                )}
            </div>
        </div>
    );
};

export default HeroTerminal;
